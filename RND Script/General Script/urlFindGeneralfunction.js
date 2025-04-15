function getURl(){
    let url = ""
    url = window.location.href ?? "";
    return url;
}
function getLocationId(){
    let loc = ""
    try {
        loc = getURl();
        console.log(loc);
        loc = loc.split('/v2/location/')[1] ?? "";
        console.log(loc)
        loc = loc.split('/')[0];
    } catch (error) {
        console.log("Error",error)
    }
    return loc;
}
function getParams(url = window.location.href){
    let params = {}
    try {
       let queryString = url.split('?')[1] ?? "";
        if(!queryString) return;
        queryString.split('&').forEach((param)=>{
            const [key,value] = param.split('=') ?? ""
            params[decodeURIComponent(key)] = decodeURIComponent(value ?? "")
        })
        
    } catch (error) {
        console.log(error)
    }
    return params;
}

getParams();