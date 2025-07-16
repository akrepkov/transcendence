cd 
PROJECT WORKFLOW GUIDE

1. GETTING STARTED
-----------------
- Run `make` in the project directory to install all necessary dependencies
- IMPORTANT: Do not push the node_modules directory (it's large and unnecessary)
- Always work on feature branches, not directly on main
- Current Node Version: 23.11
- Use the Theory folder for documentation drafts and development notes or just general random notes

2. ADDING NEW PACKAGES
---------------------
You can just test around with packages on your own branch. When you have decided we need it and want to use it for the project, proceed to the below points

1. Add the package name to packages.txt under the appropriate category:
  * backend_dependencies
  * backend_dev_dependencies
  * frontend_dependencies
  * frontend_dev_dependencies
  * currently_unnecessary-is just a place to put packages that aren't used, it's pretty much garbage we can clean up later

2. Run `make update_json`
   This command will:
  * Update all package files (package.json/package-lock.json and packages.txt)
  * Commit these changes
  * Checkout main branch
  * Merge only package-related files into main
  * Push the updates

This process ensures package files stay synchronized in the main branch. And that we don't run into weird merge conflicts.

3. CODE QUALITY TOOLS
--------------------
ESLint and Prettier:
These tools maintain code quality and consistency:
* ESLint: Catches potential errors and enforces coding standards (similar to -Wall -Werror -Wextra)
* Prettier: Formats code automatically (maintaining consistent style, similar to norminette only automated)

Automatic Checks:
* Both tools will run on every commit you make on the files you have committed
* Check and format modified files
* May show warnings for issues that can't be auto-fixed. It won't enforce fixing them, but try to fix things up if you have time

Manual Commands:
* `make lint`: Check all files
* `make lint:fix`: Check and fix(if possible) all files
* For specific directories:
  - Backend: Run `npm run lint` or `npm run lint:fix` in backend folder
  - Frontend: Same commands in frontend folder

Best Practice: Keep the main branch clean - resolve all linting errors before merging

4. GIT WORKFLOW AUTOMATION
------------------------
Post-Checkout Script:
* Automatically checks if your branch is up-to-date when switching branches
* Prompts for pull/push if needed
* If experiencing issues, you can disable it in .husky/post-checkout

Dependency Management:
* Use `npx depcheck` periodically to identify unused dependencies

5. THINGS BREAKING?
------------------------
Refer to Theory/troubleshooting.txt
