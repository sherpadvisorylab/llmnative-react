# Install LLM Native For Dev

- Create a local workspace folder for `llmnative-react`
- Clone the `@llmnative/react` repository into that folder
- Run `npm install`
- Run `npm run build:local`
- Run `npm link`

# Create New Project

- Create the project folder
- Put the `package.json` inside the project folder
- Run `npm install`
- Delete `node_modules/@llmnative` if you need to relink a fresh local build
- Run `npm link @llmnative/react`

# Scaffold New Project

- Run `npx @llmnative/react create`
- Follow the instructions

# Reinstall Project After Scaffold

- Go into the `llmnative-react` folder
- Run `npm run build:local`
- Go into the project folder
- Copy the project `.env` file somewhere safe
- Run `npx @llmnative/react create --reset`
- Copy the `.env` file back

# Create New Theme

- Clean the project folder except `package.json`, `package-lock.json`, and `node_modules`
- Create `src` and `public`
- Create the theme
- Run `npm start`

# Porting Theme

- Inside `@llmnative/react`, create the theme in `themes/[theme-name]`
- Copy the `src` and `public` folders from the new theme project

```json
{
  "name": "[theme-name]",
  "type": "module",
  "version": "1.0.0",
  "description": "",
  "author": "[author]",
  "license": "Apache-2.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-papaparse": "^4",
    "@llmnative/react": "^0.1.1",
    "react-router-dom": "^6.22.0",
    "react-scripts": "^5"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.0"
  }
}
```

# Deploy LLM Native

- Go into the `llmnative-react` folder
- Run `npm run build:local`

# Kill Process By Port 3000

```bash
netstat -aon | findstr :3000
taskkill /PID [pid_number] /F
```
