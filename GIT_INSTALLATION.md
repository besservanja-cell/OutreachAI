# Git Installation Guide

Git is not currently installed on your system. Here's how to install it:

## Option 1: Download Git for Windows (Recommended)

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - The download will start automatically

2. **Install Git:**
   - Run the downloaded installer (Git-2.x.x-64-bit.exe)
   - Follow the installation wizard:
     - Use default settings (recommended)
     - Make sure "Git from the command line and also from 3rd-party software" is selected
     - Click "Next" through the installation

3. **Restart your terminal:**
   - Close and reopen PowerShell/Command Prompt
   - Or restart Cursor/VS Code

4. **Verify installation:**
   ```powershell
   git --version
   ```

5. **Initialize your repository:**
   ```powershell
   git init
   ```

## Option 2: Install via Chocolatey (if you have it)

If you have Chocolatey package manager installed:
```powershell
choco install git -y
```

## Option 3: Install via Scoop (if you have it)

If you have Scoop package manager installed:
```powershell
scoop install git
```

## After Installation

Once Git is installed, you can initialize your repository:

```powershell
cd C:\Users\Luis\Desktop\OutreachAI
git init
git add .
git commit -m "Initial commit"
```

## Configure Git (First time setup)

After installing, configure your Git identity:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
