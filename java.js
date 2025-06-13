document.addEventListener("DOMContentLoaded", () => {
    const reviews = document.querySelectorAll(".review");

    reviews.forEach(review => {
        review.addEventListener("click", () => {
            alert("Thanks for checking out our doctors!");
        });
    });
});