const loginBtn = document.querySelector(".loginBtn");
const signupBtn = document.querySelector(".signupBtn");
const logoutBtn = document.querySelector(".logoutBtn");

const isAuthenticated = localStorage.getItem("isAdminAuthenticated");

if (isAuthenticated) {
  if (loginBtn) loginBtn.classList.add("hideBtn");
  if (signupBtn) signupBtn.classList.add("hideBtn");

  if (logoutBtn) logoutBtn.classList.remove("hideBtn");
} else {
  if (loginBtn) loginBtn.classList.remove("hideBtn");
  if (signupBtn) signupBtn.classList.remove("hideBtn");
  if (logoutBtn) logoutBtn.classList.add("hideBtn");
}

logoutBtn?.addEventListener("click", () => {
  localStorage.clear();
  location.reload(); // Reload the page to reflect the logout status
});

document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("coursesContainer");
  const editFormContainer = document.createElement("div");
  editFormContainer.id = "editFormContainer";
  document.body.appendChild(editFormContainer);

  if(!isAuthenticated){
    window.location.href = 'login.html';
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `https://skill-grow.onrender.com/api/course/fetch/usercourse/${
          JSON.parse(localStorage.getItem("adminUser")).user._id
        }`
      );
      const courses = await response.json();

      if (response.ok) {
        displayCourses(courses);
      } else {
        console.error("Error fetching courses:", courses.error);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const displayCourses = (courses) => {
    coursesContainer.innerHTML = ""; // Clear the container
  
    if (courses.length === 0) {
      // Show a message if no courses are available
      coursesContainer.innerHTML = `
        <div class="no-courses-message">
          <p>No courses available. Add courses to start.</p>
        </div>
      `;
      return;
    }
  
    courses.forEach((course) => {
      const courseCard = document.createElement("div");
      courseCard.className = "course-card";
  
      const courseThumbnail = course.thumbnailUrl
        ? `<img src="${course.thumbnailUrl}" alt="${course.title}">`
        : "";
  
      courseCard.innerHTML = `
        ${courseThumbnail}
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <div class="course-footer">
          <span>By ${course.by.firstName} ${course.by.lastName}</span>
          <span>${course.curriculum.length} Topics</span>
        </div>
        <button class="editBtn edit-button" data-course-id="${course._id}">Edit</button>
        <button class="deleteBtn delete-button" data-course-id="${course._id}">Delete</button>
      `;
  
      coursesContainer.appendChild(courseCard);
    });
  
    // Attach event listeners for the delete and edit buttons
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", handleDeleteCourse);
    });
    document.querySelectorAll(".editBtn").forEach((button) => {
      button.addEventListener("click", handleEditCourse);
    });
  };
  

  const handleDeleteCourse = async (event) => {
    const courseId = event.target.dataset.courseId;

    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(
          `https://skill-grow.onrender.com/api/course/${courseId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          alert("Course deleted successfully");
          fetchCourses(); // Refresh the list of courses
        } else {
          const data = await response.json();
          alert(`Error deleting course: ${data.error}`);
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleEditCourse = async (event) => {
    const courseId = event.target.dataset.courseId;

    // Fetch course data to pre-fill the form
    try {
      const response = await fetch(
        `https://skill-grow.onrender.com/api/course/${courseId}`
      );
      const course = await response.json();

      if (response.ok) {
        displayEditForm(course);
      } else {
        console.error("Error fetching course:", course.error);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  // Display edit form
  const displayEditForm = (course) => {
    editFormContainer.innerHTML = `
      <div class="edit-form-overlay">
        <form id="editForm" class="edit-form">
          <h2>Edit Course</h2>
          <input type="hidden" id="courseId" value="${course._id}">
          <div class="form-group">
            <label for="editTitle">Title</label>
            <input type="text" id="editTitle" value="${course.title}" required>
          </div>
          <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea id="editDescription" required>${course.description}</textarea>
          </div>
          <div class="form-group">
            <label for="editThumbnailUrl">Thumbnail URL</label>
            <input type="url" id="editThumbnailUrl" value="${course.thumbnailUrl}" required>
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" id="cancelEditBtn">Cancel</button>
        </form>
      </div>
    `;

    // Add event listeners for form submission and cancel button
    const editForm = document.getElementById("editForm");
    const cancelEditBtn = document.getElementById("cancelEditBtn");

    editForm.addEventListener("submit", handleUpdateCourse);
    cancelEditBtn.addEventListener("click", () => {
      editFormContainer.innerHTML = "";
    });
  };

  // Handle update course
  const handleUpdateCourse = async (event) => {
    event.preventDefault();

    const courseId = document.getElementById("courseId").value;
    const title = document.getElementById("editTitle").value;
    const description = document.getElementById("editDescription").value;
    const thumbnailUrl = document.getElementById("editThumbnailUrl").value;

    const updatedCourse = { title, description, thumbnailUrl };

    try {
      const response = await fetch(
        `https://skill-grow.onrender.com/api/course/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCourse),
        }
      );

      if (response.ok) {
        alert("Course updated successfully");
        editFormContainer.innerHTML = "";
        fetchCourses(); // Refresh the list of courses
      } else {
        const data = await response.json();
        alert(`Error updating course: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  fetchCourses();
});
