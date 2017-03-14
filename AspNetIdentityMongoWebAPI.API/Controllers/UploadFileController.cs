using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;


namespace AspNetIdentityMongoWebAPI.API.Controllers
{
    [RoutePrefix ("api/uploadfile")]
    public class UploadFileController : ApiController
    {
        // GET: UploadFile

        [HttpPost]
        [Route("UploadItem")]
        public IHttpActionResult getImage(string user)
        {
            try
            {
                // System.Web.UI.Page page = new Page();
                //int count = 0;
                //if (file != null)
                //{
                //    //foreach (var file in files)
                //    //{
                //        if (file != null && file.ContentLength > 0)
                //        {
                //            var filename = Guid.NewGuid() + Path.GetExtension(file.FileName);
                //            var path = Path.Combine(page.Server.MapPath("~/images/"), filename);
                //            file.SaveAs(path);
                //            count++;
                //        }
                //    //}
                //}
                HttpFileCollection file = HttpContext.Current.Request.Files;
                string generate = Guid.NewGuid().ToString();
                string extension = "";

                for (int i = 0; i < file.Count; i++)
                {
                    HttpPostedFile hpf = file[i];
                    if (hpf.ContentLength > 0)
                    {
                        FileInfo info = new FileInfo(hpf.FileName);
                        extension = info.Extension;
                        string filename = generate + "" + extension;
                        hpf.SaveAs(HttpContext.Current.Server.MapPath("~/ads_images/") +
                          filename);//Path.GetFileName(hpf.FileName)
                    }
                }

                return Ok("ads_images/" + generate + "" + extension);
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        public string renameFile(string filename)
        {
            return "";
        }


        [AcceptVerbs("Post")]
        [Route("PostProfileImage")]
        public HttpResponseMessage PostProfileImage(string manager)
        {
            HttpResponseMessage result = default(HttpResponseMessage);
            List<string> fi = default(List<string>);
            HttpRequest requests = HttpContext.Current.Request;
            var Path = "uploads/" + manager + "/";
            // "images/"
            //string dpath = null;
            if ((requests.Files.Count > 0))
            {
                try
                {
                    System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~\\") + "uploads\\" + manager);
                }
                catch (Exception )
                {
                }
                //
                fi = new List<string>();
                foreach (string file in requests.Files)
                {
                    HttpPostedFile postedFile = requests.Files.Get(file);
                    //string newpath = newp(postedFile.FileName, HttpContext.Current.Server.MapPath("~\\") + Path);

                    //Dim filePath = HttpContext.Current.Server.MapPath("~/img/" + postedFile.FileName)
                    dynamic filePath = HttpContext.Current.Server.MapPath("~/uploads/" + manager + "/" + postedFile.FileName);
                    try
                    {
                        postedFile.SaveAs(filePath);
                        fi.Add(filePath);
                        
                    }
                    catch (Exception)
                    {
                        result = Request.CreateResponse(HttpStatusCode.BadRequest);
                    }


                }

            //    char[] delimiters = new char[] {
            //    '\\',
            //    '|'
            //};
            //    string[] str = listToString(fi).Split(delimiters);
                //fi)Path) '
                //If (checkTransId(transid, manager)) Then
                //    imageDetails(Path & str(str.Length - 2), str(str.Length - 2), manager, transid)
                result = Request.CreateResponse(HttpStatusCode.Created);//, Conversion.str(str.Length - 2));
                //Else
                //    result = Request.CreateResponse(HttpStatusCode.BadRequest)
                //End If
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }




    }


         
}