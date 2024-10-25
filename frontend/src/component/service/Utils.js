export default class Utils{
    static logOut = () => {
        localStorage.removeItem("role")
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    static upperCaseFirst = (text) =>{
        return text[0].toUpperCase() + text.slice(1);
    }
    static formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };
    
}