async function checkAuthAndRedirect() {
    const token = localStorage.getItem('isAdminAuthenticated');
    console.log(token, "token is")

    if(!token){
        window.location.href = 'login.html';
        return;
    }
}

document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);

document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('courseForm');
    const topicsContainer = document.getElementById('topicsContainer');
    const addTopicBtn = document.getElementById('addTopicBtn');

    // Function to create a topic element
    const createTopicElement = () => {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic';
        topicDiv.innerHTML = `
            <div class="form-group">
                <label>Topic Title</label>
                <input type="text" name="topicTitle" required>
            </div>
            <div class="form-group">
                <label>Topic Description</label>
                <textarea name="topicDescription" required></textarea>
            </div>
            <div class="form-group">
                <label>Videos</label>
                <div class="videosContainer"></div>
                <button type="button" class="addVideoBtn">Add Video</button>
            </div>
            <button type="button" class="removeBtn">Remove Topic</button>
        `;

        topicsContainer.appendChild(topicDiv);

        // Handle adding videos to this topic
        const addVideoBtn = topicDiv.querySelector('.addVideoBtn');
        const videosContainer = topicDiv.querySelector('.videosContainer');
        addVideoBtn.addEventListener('click', () => {
            addVideo(videosContainer);
        });

        // Handle removing the topic
        const removeBtn = topicDiv.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => {
            topicDiv.remove();
        });
    };

    // Function to create a video element
    const addVideo = (videosContainer) => {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'video';
        videoDiv.innerHTML = `
            <div class="form-group">
                <label>Video Title</label>
                <input type="text" name="videoTitle" required>
            </div>
            <div class="form-group">
                <label>Video URL</label>
                <input type="url" name="videoUrl" required>
            </div>
            <div class="form-group">
                <label>Video Duration (minutes)</label>
                <input type="number" name="videoDuration" required min="1">
            </div>
            <button type="button" class="removeBtn">Remove Video</button>
        `;
        videosContainer.appendChild(videoDiv);

        // Handle removing the video
        const removeVideoBtn = videoDiv.querySelector('.removeBtn');
        removeVideoBtn.addEventListener('click', () => {
            videoDiv.remove();
        });
    };

    // Add initial topic
    createTopicElement();

    // Add new topic when the button is clicked
    addTopicBtn.addEventListener('click', () => {
        createTopicElement();
    });

    // Handle form submission
    courseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(courseForm);
        const course = {
            title: formData.get('title'),
            description: formData.get('description'),
            thumbnailUrl: formData.get('thumbnailUrl'),
            curriculum: []
        };

        // Collecting topics
        document.querySelectorAll('.topic').forEach((topicDiv) => {
            const topic = {
                title: topicDiv.querySelector('input[name="topicTitle"]').value,
                description: topicDiv.querySelector('textarea[name="topicDescription"]').value,
                videos: []
            };

            // Collecting videos for each topic
            topicDiv.querySelectorAll('.video').forEach((videoDiv) => {
                const video = {
                    title: videoDiv.querySelector('input[name="videoTitle"]').value,
                    url: videoDiv.querySelector('input[name="videoUrl"]').value,
                    duration: videoDiv.querySelector('input[name="videoDuration"]').value
                };
                topic.videos.push(video);
            });

            course.curriculum.push(topic);
        });
        const adminUser = JSON.parse(localStorage.getItem("adminUser"));
        course.by = adminUser.user._id;
        try {
            const response = await fetch('http://localhost:5000/api/course/create-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser')).token}`, 
                },
                body: JSON.stringify(course)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Course created successfully');
                courseForm.reset();
                topicsContainer.innerHTML = '<h2>Curriculum</h2><button type="button" id="addTopicBtn">Add Topic</button>';
                createTopicElement();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert('Error creating course');
        }
    });
});
