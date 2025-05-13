/**
 *  This function is used to open the profile tab and handle the image upload.
 *  It listens for a click event on the default avatar image, and when clicked, it triggers a file input to select an image.
 *  Once an image is selected, it reads the file and sets the image source to the selected file.
 *  It also uploads the image to the backend using a POST request.
 *  The function uses the Fetch API to send the image data to the server.
 *  The server should handle the image upload and return a success response.
 */
export function uploadAvatar(){

    const defaultAvatar = document.getElementById("defaultAvatar");
    const fileInput = document.getElementById("fileInput");
    
    // When the image is clicked, trigger the file input
    defaultAvatar.addEventListener("click", function () {
        fileInput.click();
    });
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0]; //get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                defaultAvatar.src = e.target.result; // Set the image source to the selected file
            };
            reader.readAsDataURL(file);
        }

        //uploading the image to backend
        const formData = new FormData();
        formData.append("avatar", file);
        fetch("/api/upload-avatar", {
            method: "POST",
            body: formData,
            credentials: 'include' // Include cookies in the request
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Avatar uploaded successfully");
                } else {
                    console.error("Error uploading avatar");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
}
