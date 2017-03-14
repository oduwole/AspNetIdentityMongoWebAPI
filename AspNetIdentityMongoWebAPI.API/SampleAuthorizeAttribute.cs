using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Deitalyst.API
{
    //class SampleAuthorizeAttribute : AuthorizeAttribute
    //{
    //    public override virtual bool AuthorizeCore(HttpContextBase httpContext)
    //    {
    //        IPrincipal user = httpContext.User;
    //        IIdentity identity = user.Identity;

    //        if (!identity.IsAuthenticated)
    //        {
    //            return false;
    //        }

    //        bool isAuthorized = true;
    //        // TODO: perform custom authorization against the CMS


    //        return isAuthorized;
    //    }
    //}
}
