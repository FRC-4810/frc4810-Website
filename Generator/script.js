let headerTemplate = "";
let cppTemplate = "";

// Load both templates
Promise.all([
    fetch("template_h.txt").then(r => r.text()),
    fetch("template_cpp.txt").then(r => r.text())
]).then(([hText, cppText]) => {
    headerTemplate = hText;
    cppTemplate = cppText;
}).catch(err => {
    alert("Failed to load template files");
    console.error(err);
});

document.getElementById("generateBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    if (!name) {
        alert("Enter a machine name");
        return;
    }

    // Derived variants
    const replacements = {
        "{{MACHINE_NAME}}": name,
        "{{MACHINE_NAME_LOWER}}": name.toLowerCase()
    };

    const headerOutput = applyReplacements(headerTemplate, replacements);
    const cppOutput = applyReplacements(cppTemplate, replacements);

    downloadFile(`${name}.h`, headerOutput);
    downloadFile(`${name}.cpp`, cppOutput);
});

function applyReplacements(template, replacements) {
    let result = template;
    for (const key in replacements) {
        result = result.replaceAll(key, replacements[key]);
    }
    return result;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}
