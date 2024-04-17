@group(0) @binding(0) var<storage, read_write> dataArray: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let idx = global_id.x;
    if (idx < arrayLength(&dataArray)) {
        dataArray[idx] = dataArray[idx] + 1.0;  // Example operation on the array
    }
}
