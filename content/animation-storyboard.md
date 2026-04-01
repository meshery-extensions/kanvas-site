---
title: "Storyboard Animation Prototype"
date: 2026-03-16
draft: false
---
<div style="background:#404040;height:500px;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center">

<h2 id="text">
James, Mario, Len, Jorge, Sara, and Ayush need to build a cloud native application.
</h2>

<p>
Avatars slide down onto the screen as six mice fly onto a blank MeshMap design.
</p>

<div id="avatars"></div>

</div>

<script>
const container = document.getElementById("avatars")

for(let i=0;i<6;i++){
  const avatar = document.createElement("div")
  avatar.style.width="40px"
  avatar.style.height="40px"
  avatar.style.borderRadius="50%"
  avatar.style.background="#00B39F"
  avatar.style.position="relative"
  avatar.style.margin="10px"
  avatar.style.top="-100px"

  container.appendChild(avatar)

  let pos=-100
  const interval=setInterval(()=>{
    pos+=2
    avatar.style.top=pos+"px"
    if(pos>=0) clearInterval(interval)
  },20)
}
</script>
