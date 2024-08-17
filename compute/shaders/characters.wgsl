struct Character {
    position_x: f32,
    position_y: f32,
    size_width: f32,
    size_height: f32,
    page: f32,
    line: f32,
    lineIndex: f32,
    charType: f32,
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
        let otherCharWidth = otherChar.size_width + 1.0; // letter spacing
        
        if (lineWidth + otherCharWidth > docDimensions.width || otherChar.charType == 1.0) { // check if newline
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
            char.lineIndex = f32(i - u32(lineWidth / otherCharWidth));
        }
        
        lineWidth += otherCharWidth;
    }

    characters[index] = char;
}