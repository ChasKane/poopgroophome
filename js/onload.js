   
var sessId, baseUrl = "http://104.248.113.22", objRequest, dbReqParam, xmlHRequest, tObjs, tIds;

 /*function that includes html*/
function includeHTML(arg)
{
    var html, i, elmnt, file, xhttp, id;
    file = arg

    /*loop thru html elements*/
    html = document.getElementsByTagName("*");
    for (i = 0; i < html.length; i++) 
    {
        elmnt = html[i];

        if (elmnt.getAttribute("content-include-html") == "This is where the other HTML conent is displayed")
        {
            /*make http req*/
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function()
            {
                if (this.readyState == 4)
                {
                    if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                    if (this.status == 404) {elmnt.innerHTML = "ERR 404: page not found!";}
                    /*edit attrib, call again*/
                    elmnt.setAttribute("content-include-html", "nope");
                    includeHTML();
                    elmnt.setAttribute("content-include-html", "This is where the other HTML conent is displayed");
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            
            return;
        }
    }
}

        
// focus an element
function focusPocus()
{
    document.getElementById("userCard_ID").focus();
}
        
