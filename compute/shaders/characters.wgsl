// struct Character {
//     // position: vec2<f32>,
//     // size: vec2<f32>,
//     positionX: f32,
//     positionY: f32,
//     sizeWidth: f32,
//     sizeHeight: f32,

//     page: f32,
//     line: f32,
//     lineIndex: f32,
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
//     var currentLine = char.line;
//     var currentPage = 0.0;
//     var lineWidth = 0.0;
//     var yOffset = 0.0;

//     // First pass: calculate line widths and adjust line/page numbers
//     for (var i = 0u; i < arrayLength(&characters); i++) {
//         let otherChar = characters[i];
//         if (otherChar.line == currentLine) {
//             lineWidth += otherChar.sizeWidth;
//             if (lineWidth > docDimensions.width) {
//                 currentLine += 1.0;
//                 lineWidth = otherChar.sizeWidth;
//                 yOffset += docDimensions.lineHeight;
//                 if (yOffset + docDimensions.lineHeight > docDimensions.pageHeight) {
//                     currentPage += 1.0;
//                     yOffset = 0.0;
//                 }
//             }
//         }
//         if (i == index) {
//             break;
//         }
//     }

//     // Second pass: set final position and location
//     lineWidth = 0.0;
//     let currentLineCount = 0.0;
//     for (var i = 0u; i < arrayLength(&characters); i++) {
//         var otherChar = characters[i];
        
//         if (otherChar.line == currentLine) { // doesnt work because all chars have line as 0 to start
//             if (i == index) {
//                 // char.position = vec2<f32>(lineWidth, yOffset);
//                 char.positionX = lineWidth;
//                 char.positionY = yOffset;
//                 char.page = currentPage;
//                 char.line = currentLine;
//                 // char.lineIndex = f32(i - u32(lineWidth / char.sizeWidth));
//                 char.lineIndex = currentLineCount;
//                 break;
//             }
//             currentLineCount += 1.0;
//             lineWidth += otherChar.sizeWidth;
//         }
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

    for (var i = 0u; i <= index; i++) {
        let otherChar = characters[i];
        
        if (lineWidth + otherChar.size_width > docDimensions.width) {
            // Move to next line
            currentLine += 1.0;
            yOffset += docDimensions.lineHeight;
            lineWidth = 0.0;
            
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
            char.lineIndex = f32(i - u32(lineWidth / otherChar.size_width));
        }
        
        lineWidth += otherChar.size_width;
    }

    characters[index] = char;
}