
const validateForm = () => {
    const searchString = document.getElementById("search_string").value;
    if (searchString == "") {
        alert ("Search string is empty!");
        return false
    } else {
        return true;
    }
}