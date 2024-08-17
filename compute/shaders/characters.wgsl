// struct Character {
//     position_x: f32,
//     position_y: f32,
//     size_width: f32,
//     size_height: f32,
//     page: f32,
//     line: f32,
//     lineIndex: f32,
//     charType: f32,
// };

// struct DocumentDimensions {
//     width: f32,
//     height: f32,
//     lineHeight: f32,
//     pageHeight: f32,
// };

// @group(0) @binding(0) var<storage, read_write> characters: array<Character>;
// @group(0) @binding(1) var<uniform> docDimensions: DocumentDimensions;

// @compute @workgroup_size(256)
// fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
//     let index = global_id.x;
//     if (index >= arrayLength(&characters)) {
//         return;
//     }

//     var char = characters[index];
//     var currentLine = 0.0;
//     var currentPage = 0.0;
//     var lineWidth = 0.0;
//     var yOffset = 0.0;

//     for (var i = 0u; i <= index; i++) {
//         let otherChar = characters[i];
//         let otherCharWidth = otherChar.size_width + 1.0; // letter spacing
        
//         if (lineWidth + otherCharWidth > docDimensions.width || otherChar.charType == 1.0) { // check if newline
//             // Move to next line
//             currentLine += 1.0;
//             yOffset += docDimensions.lineHeight;
//             lineWidth = 0.0;
            
//             if (yOffset + docDimensions.lineHeight > docDimensions.pageHeight) {
//                 // Move to next page
//                 currentPage += 1.0;
//                 yOffset = 0.0;
//             }
//         }
        
//         if (i == index) {
//             // Set final position and location for the current character
//             char.position_x = lineWidth;
//             char.position_y = yOffset;
//             char.page = currentPage;
//             char.line = currentLine;
//             char.lineIndex = f32(i - u32(lineWidth / otherCharWidth));
//         }
        
//         lineWidth += otherCharWidth;
//     }

//     characters[index] = char;
// }

struct Character {
    position_x: f32,
    position_y: f32,
    size_width: f32,
    size_height: f32,
    page: f32,
    line: f32,
    lineIndex: f32,
    charType: f32,
    lastCharacterOfLine: f32,
};

struct DocumentDimensions {
    width: f32,
    height: f32,
    lineHeight: f32,
    pageHeight: f32,
};

@group(0) @binding(0) var<storage, read_write> characters: array<Character>;
@group(0) @binding(1) var<uniform> docDimensions: DocumentDimensions;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&characters)) {
        return;
    }

    var char = characters[index];
    var currentLine = 0.0;
    var currentPage = 0.0;
    var lineWidth = 0.0;
    var yOffset = 0.0;
    var lastLineBreakIndex = 0u;

    for (var i = 0u; i <= index; i++) {
        let otherChar = characters[i];
        let otherCharWidth = otherChar.size_width + 1.0; // letter spacing
        
        if (lineWidth + otherCharWidth > docDimensions.width || otherChar.charType == 1.0) {
            // This character causes a line break
            if (i > 0u && i - 1u == index) {
                // If the previous character is the one we're processing,
                // mark it as the last character of the line
                char.lastCharacterOfLine = 1.0;
            }
            
            // Move to next line
            currentLine += 1.0;
            yOffset += docDimensions.lineHeight;
            lineWidth = 0.0;
            lastLineBreakIndex = i;
            
            if (yOffset + docDimensions.lineHeight > docDimensions.pageHeight) {
                // Move to next page
                currentPage += 1.0;
                yOffset = 0.0;
            }
        }
        
        if (i == index) {
            // Set final position and location for the current character
            char.position_x = lineWidth;
            char.position_y = yOffset;
            char.page = currentPage;
            char.line = currentLine;
            char.lineIndex = f32(i - lastLineBreakIndex);
            
            // If this character doesn't cause a line break and there are more characters,
            // we can potentially break the loop
            if (i < arrayLength(&characters) - 1u &&
                lineWidth + char.size_width + 1.0 <= docDimensions.width &&
                char.charType != 1.0) {
                
                let nextChar = characters[i + 1u];
                if (lineWidth + char.size_width + 1.0 + nextChar.size_width + 1.0 > docDimensions.width ||
                    nextChar.charType == 1.0) {
                    // The next character will start a new line, so this one is last on the line
                    char.lastCharacterOfLine = 1.0;
                }
                
                break; // We can safely break here as no further processing is needed
            }
        }
        
        lineWidth += otherCharWidth;
    }

    characters[index] = char;
}