export default function Logout() {
    const fetchUserDetails = async()=>{
        const dataResponse = await fetch(summuryAPI.UserDetails.url,{
            method:summuryAPI.UserDetails.method,
            credentials:"include"

        });   
    }
    return (
        <div>
         
        </div>
    )
}