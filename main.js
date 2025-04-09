//----token link pest Karen----//
const token = "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";
const headers = {
  Authorization: `token ${token}`,
  Accept: "application/vnd.github.v3+json"
};

// Set username in header
document.getElementById("username").innerText = "Shamaali86055";

// Left menu toggle
document.getElementById("leftMenuBtn").onclick = () => {
  const menu = document.getElementById("leftMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

// Right menu toggle
document.getElementById("rightMenuBtn").onclick = () => {
  const menu = document.getElementById("rightMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};


//-------new Repo banane ke liye-------//
function addNewRepo() {
  const repoName = prompt("Enter new repo name:");
  if (!repoName) return;

  fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: repoName,
      auto_init: true,
      private: false
    })
  })
    .then(res => res.json())
    .then(data => alert(`Repo created: ${data.full_name}`))
    .catch(err => alert("Error creating repo"));
}


//-------all report dekhne ke liye----//
function viewRepos() {
  fetch("https://api.github.com/user/repos", { headers })
    .then(res => res.json())
    .then(repos => {
      const oldList = document.getElementById("repoList");
      if (oldList) oldList.remove();

      const oldFiles = document.getElementById("fileList");
      if (oldFiles) oldFiles.remove();

      const listDiv = document.createElement("div");
      listDiv.id = "repoList";
      listDiv.className = "listDiv";

      const heading = document.createElement("h2");
      heading.innerText = "Your Repositories:";
      listDiv.appendChild(heading);

      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";

      repos.forEach(r => {
        const li = document.createElement("div");
        li.innerText = r.full_name;
        li.className = "lis";
        li.style.cursor = "pointer";
        li.onclick = () => openRepo(r.owner.login, r.name);
        ul.appendChild(li);
      });

      listDiv.appendChild(ul);
      document.body.appendChild(listDiv);
    });
}

//----repon ko open karne ke liye----//
function openRepo(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents`;

  fetch(url, { headers })
    .then(res => res.json())
    .then(files => {
      const oldFiles = document.getElementById("fileList");
      if (oldFiles) oldFiles.remove();

      const div = document.createElement("div");
      div.id = "fileList";
      div.className = "listDiv";

      const heading = document.createElement("h2");
      heading.innerText = `Files in ${repo}:`;
      div.appendChild(heading);

      const ul = document.createElement("ul");
      files.forEach(file => {
        const li = document.createElement("li");
        li.innerText = file.name;
        li.onclick = () => openFile(owner, repo, file.path);
        ul.appendChild(li);
      });
      div.appendChild(ul);

      const uploadLabel = document.createElement("label");
      uploadLabel.innerText = "Upload File:";
      const input = document.createElement("input");
      input.multiple = true;
      input.type = "file";
      input.onchange = (e) => uploadFile(owner, repo, e.target.files[0]);

      div.appendChild(uploadLabel);
      div.appendChild(input);

      document.body.appendChild(div);
    });
}


//----Repo mein file upload karne ke liye---//
function uploadFile(owner, repo, file) {
  const reader = new FileReader();
  reader.onload = () => {
    const content = btoa(reader.result);

    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.name}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Upload ${file.name}`,
        content: content
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("File uploaded successfully");
      openRepo(owner, repo); // refresh list
    })
    .catch(err => alert("Upload failed"));
  };

  reader.readAsBinaryString(file);
}


//---repon ko Hari name karne ke liye----//
function renameRepo() {
  const oldName = prompt("Old repo name:");
  const newName = prompt("New repo name:");
  if (!oldName || !newName) return;

  fetch(`https://api.github.com/repos/Shamaali86055/${oldName}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name: newName })
  })
  .then(res => res.json())
  .then(data => alert("Renamed to: " + data.name))
  .catch(err => alert("Rename failed"));
}



//----report delete karne ke liye-----//
function deleteRepo() {
  const repoName = prompt("Repo name to delete:");
  if (!repoName) return;

  fetch(`https://api.github.com/repos/Shamaali86055/${repoName}`, {
    method: "DELETE",
    headers
  })
  .then(res => {
    if (res.status === 204) alert("Repo deleted");
    else alert("Failed to delete repo");
  });
}

// Connect buttons
document.querySelector(".sidebar button:nth-child(1)").onclick = addNewRepo;
document.querySelector(".sidebar button:nth-child(2)").onclick = viewRepos;
document.querySelector(".dropdown button:nth-child(1)").onclick = renameRepo;
document.querySelector(".dropdown button:nth-child(2)").onclick = deleteRepo;