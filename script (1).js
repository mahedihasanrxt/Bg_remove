document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.src = e.target.result;
            document.getElementById('imageContainer').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('removeBackground').addEventListener('click', function() {
    const uploadedImage = document.getElementById('uploadedImage');
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = 'Removing background...';

    const file = document.getElementById('imageUpload').files[0];
    if (!file) {
        resultContainer.innerHTML = 'Please upload an image first.';
        return;
    }

    // Create FormData object to send the image to the remove.bg API
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': 'epKVaKznwzUBZsnKvqgvEd7T',  // Your API key
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const resultImage = URL.createObjectURL(blob);
        resultContainer.innerHTML = '<h3>Background Removed!</h3><p>Download the new image below:</p>';
        
        // Create a download link for the image
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = 'image-without-background.png';
        link.textContent = 'Download Image';
        resultContainer.appendChild(link);
        resultContainer.style.display = 'block';

        // Clear any previous download URL to avoid memory leaks
        link.addEventListener('click', () => {
            setTimeout(() => {
                URL.revokeObjectURL(resultImage);
            }, 100);
        });
    })
    .catch(error => {
        console.error(error);
        resultContainer.innerHTML = 'An error occurred while removing the background.';
        resultContainer.style.display = 'block';
    });
});
