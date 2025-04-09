function openFile(owner, repo, path) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // Clear all content from body
  

  // Loading message
  const loading = document.createElement("div");
  loading.innerText = "Loading file...";
  loading.id = "loadingFile";
  loading.style.padding = "10px";
  loading.style.fontWeight = "bold";
  loading.className = "edit";
  document.body.appendChild(loading);

  fetch(url, { headers })
    .then(res => res.json())
    .then(file => {
      document.getElementById("loadingFile")?.remove();

      const content = atob(file.content);
      const editorDiv = document.createElement("div");
      editorDiv.className = "editorBox";
      editorDiv.style.border = "1px solid #ccc";
      editorDiv.style.width = "100vw"
      editorDiv.style.height = "870px";
      editorDiv.style.margin = "0";
      editorDiv.style.background = "black";

      const heading = document.createElement("h3");
      heading.innerText = `Editing: ${file.name}`;
      editorDiv.appendChild(heading);

      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.width = "95%";
      textarea.style.height = "80%";
      textarea.style.margin = "10px 0";
      textarea.style.background = "black"
      textarea.style.color = "#fff"
      editorDiv.appendChild(textarea);

      const btnBox = document.createElement("div");
      btnBox.style.display = "flex";
      btnBox.style.gap = "10px";
      btnBox.className = "btnBox";

      const saveBtn = document.createElement("button");
      saveBtn.innerText = "Save";
      saveBtn.style.padding = "5px 10px";
      saveBtn.onclick = () => {
        const newContent = btoa(textarea.value);
        fetch(url, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            message: `Update ${file.name}`,
            content: newContent,
            sha: file.sha
          })
        })
          .then(res => res.json())
          .then(data => {
            alert("File updated successfully");
            editorDiv.remove();
          })
          .catch(err => alert("Update failed"));
      };

      const cancelBtn = document.createElement("button");
      cancelBtn.innerText = "Cancel";
      cancelBtn.style.padding = "5px 10px";
      cancelBtn.onclick = () => editorDiv.remove();

      btnBox.appendChild(saveBtn);
      btnBox.appendChild(cancelBtn);
      editorDiv.appendChild(btnBox);

      document.body.appendChild(editorDiv);
    })
    .catch(err => {
      document.getElementById("loadingFile")?.remove();
      alert("Error loading file");
    });
}