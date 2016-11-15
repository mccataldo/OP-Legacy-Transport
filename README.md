#Getting Started
##Download & Install this Extension
1. Click "Download Zip" from the Github repo and save it to your local machine
2. Unzip the file
3. Open Chrome
4. Navigate to "chrome://extensions/"
5. Click "Load Unpacked Extension..."
6. Select the entire folder of the unzipped extension you downloaded
7. Make sure "Enabled" is checked for the extension
8. Chrome should have a new extension button at the top right

#Usage
##Copy an ObservePoint Web Audit
1. Login to ObservePoint (legacy) and navigate to an existing Web Audit in edit mode
2. Click the extension icon in Chrome
3. Navigate to the Audits tab on the new platform where you want the Web Audit pasted
4. Click the icon again
5. The copied Web Audit will appear in the Audits tab

##Copy an ObservePoint Web Journey
1. Login to ObservePoint (legacy) and navigate to an existing Web Journey (Simulation) in edit mode
2. Click the extension icon in Chrome
3. Navigate to the Journeys tab on the new platform where you want the Web Journey to be pasted
4. Click the icon again
5. The new Web Journey will appear in the Journeys tab

#Limitations (version 0.4)
- Rules and Rule Sets field values will not be copied
- User Agent field value will not be copied but the title of the new object contains this value so you can reference it at any time to update the field.
- Email/Notifications field value will not be copied, but the functionality exists. It has only been disabled temporarily to prevent customers from getting notifications while testing or training.
- Audits page maximum is currently capped at 100, therefore this tool will paste the page maximum value as 100 for values over 100 to respect this cap.

##If you have problems
- If nothing happens when you click the extension button to paste, you may need to refresh the page - especially if you recently installed the extension. It won't work until you refresh the page.
- If it still doesn't work, open the Chrome Dev Tools Console to check for errors. When copying, the JSON data copied will appear parsed and strigified (as an object or a string). Log messages for the pasting actions may be added in the future.
- Keep in mind that this tool copies only from the edit form for simulations and audits in legacy and pastes only to the audits and journeys tabs in the new platform. Everywhere else, the button is disabled by design.
- If all else fails, contact me.
