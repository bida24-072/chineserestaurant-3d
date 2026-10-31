# 🥢 Golden Dragon - 3D Chinese Restaurant Website

A fully responsive, multi-page restaurant website featuring an interactive 3D scene. Built completely with pure code (Three.js, HTML, CSS, and JavaScript) without any external 3D models. 

Designed specifically for a premium Chinese Restaurant located at the **iTowers, Gaborone, Botswana (near Room50Two)**.

## ✨ Features

*   **Scroll-Interactive 3D:** As you scroll down the homepage, the 3D camera dynamically pans, pulls back, and rotates the Chef to reveal different angles while the text overlays scroll seamlessly.
*   **Procedural 3D Chef:** The chef, his hat, face, mustache, and the wok are all generated mathematically using Three.js geometries.
*   **Simulated Physics:** The food in the wok uses a custom gravity script. As the chef tosses the pan, food flies up, spins in mid-air, and falls back down.
*   **Multi-Page Architecture:** Includes Home, Menu, About, and Contact pages sharing a unified CSS design.
*   **Premium Aesthetic:** Uses a deep red, black, and gold color palette, complete with fog, warm spotlights, and red rim lighting.

## 📁 File Structure

*   `index.html`: The homepage with the fixed 3D canvas and scrollable HTML sections.
*   `menu.html`: A styled grid of menu items.
*   `about.html`: The restaurant's story.
*   `contact.html`: Location details (iTowers) and a booking form.
*   `style.css`: Shared styling across all pages.
*   `main.js`: The Three.js logic, custom physics, and the scroll-to-camera interpolation.

## 🚀 How to Run

Because the 3D scene uses ES Modules, it must be run on a local server.
1. Open the project folder in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.

## 🌐 Deploying to GitHub Pages

1. Create a repository on GitHub.
2. Upload all HTML files, `style.css`, `main.js`, and `README.md`.
3. Go to **Settings** > **Pages** > **Deploy from a branch** > Select `main` and `/ (root)`.
4. Click Save. Wait 2 minutes for the live link!

## 🧠 How the Scroll Interaction Works

In `main.js`, we listen for the `scroll` event on the window. We calculate the `scrollPercent` (0 to 1) based on how far down the user is. We then use **Linear Interpolation (Lerp)** in the animation loop to smoothly move the `camera.position.y`, `camera.position.z`, and rotate the `chefGroup`. This creates a cinematic 3D effect where scrolling down reveals more of the kitchen scene.
