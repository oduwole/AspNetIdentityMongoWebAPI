using AspNetIdentityMongoWebAPI.API.Models;
using AspNetIdentityMongoWebAPI.API.Results;
using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Owin;
using AspNetIdentityMongoWebAPI.API.Repository;
using AspNetIdentityMongoWebAPI.API.Context;
using AspNet.Identity.MongoDB;
using AspNetIdentityMongoWebAPI.API.App_Start;
using MongoDB.Driver;

namespace AspNetIdentityMongoWebAPI.API.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private CancellationTokenSource cts;
        private AuthRepository _repo = null;
        private ApplicationUserManager _userManager;

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        public AccountController()
        {
            _repo = new AuthRepository();
            cts = new CancellationTokenSource();
        }

        //public AccountController(ApplicationUserManager userManager)
        //{
        //    UserManager = userManager;
        //}

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }


        //[Route("")]
        //[HttpPost]
        //public Task<HttpResponse > SignOutClient(int clientId)
        //{
        //    var user = UserManager.FindById(User.Identity.GetUserId());
        //    //var user =await _repo.FindUserById(User.Identity.GetUserId);
        //    var client = user.Client.SingleOrDefault(c => c.Id == clientId);
        //    //var cli=user.
        //    if (client != null)
        //    {
        //        user.Clients.Remove(client);
        //    }
        //    UserManager.Update(user);
        //}


        //public const string CodeKey = "code";
        //public static string GetCodeFromRequest(HttpRequest request)
        //{
        //    return request.QueryString(CodeKey);
        //}

        //public const string UserIdKey = "userId";
        //public static string GetUserIdFromRequest(HttpRequest request)
        //{
        //    return HttpUtility.UrlDecode(request.QueryString(UserIdKey));
        //}

        //public static string GetUserConfirmationRedirectUrl(string code, string userId, HttpRequest request)
        //{
        //    dynamic absoluteUri = "/Account/Confirm?" + CodeKey + "=" + HttpUtility.UrlEncode(code) + "&" + UserIdKey + "=" + HttpUtility.UrlEncode(userId);
        //    return new Uri(request.Url, absoluteUri).AbsoluteUri.ToString();
        //}

        [HttpPost]
        [Route("confirmEmail")]
        public async Task<IHttpActionResult> confirmEmail(ConfirmCodeModel model)
        {
            //if (ModelState.IsValid)
            //{
            var result = await _repo.ConfirmCode(model);
            if (result.Succeeded)
            {
                return Ok();
            }
            //if (result)
            //{
            //    return Ok();
            //}

            //}
            return GetErrorResult(result);
            //BadRequest();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ForgotPassword")]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var baseUrl = Request.RequestUri.GetLeftPart(UriPartial.Authority);
                //var user = await UserManager.FindByNameAsync(model.Email);
                //var user =await _repo.FindUserByEmail(model.Email);
                var result = await _repo.ForgotPassword(model.Email, baseUrl);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("The user either does not exist or is not confirmed.");
                }
                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                //string code = await UserManager.GetPasswordResetTokenAsync(user.Id);

            }

            return Ok();

            // If we got this far, something failed, redisplay form
            //return View(model);
        }
        /// <summary>
        /// Return All The Roles with its corresponding details in the Application
        /// </summary>
        /// <returns>IQueryable<ApplicationRole>></returns>
        [AcceptVerbs("Get")]
        [Route("GetAllRoles")]
        public IHttpActionResult GetAllRoles()
        {
            var result = _repo.GetAllRoles();
            return Ok(result.ToList());
        }

        /// <summary>
        /// Return only list of all roles
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs("Get")]
        [Route("GetAllRolesList")]
        public IHttpActionResult GetAllRolesList()
        {
            var result = _repo.GetAllRolesList();
            return Ok(result);
        }

        /// <summary>
        /// Return only list of all roles a particular users has
        /// </summary>
        /// <returns></returns>
        [AcceptVerbs("Get")]
        [Route("GetUsersRoles")]
        public IHttpActionResult GetUsersRoles(string user)
        {
            var result = _repo.GetUsersRoles(user);
            return Ok(result);
        }

        
            [AcceptVerbs("Get")]
            [Route("GetUserDetails")]
        public IHttpActionResult GetUserDetails(string user)
        {
            var result = _repo.GetUserDetails(user);
            return Ok(result);
        }

        [AcceptVerbs("Get")]
        [Route("GetAllUsers")]
        public IHttpActionResult GetAllUsers()
        {
            var result = _repo.GetAllUsers();
            return Ok(result);
        }
        
        [AcceptVerbs("Get")]
        [Route("GetAllUsersList")]
        public IHttpActionResult GetAllUsersList()
        {
            var result = _repo.GetAllUsersList();
            return Ok(result);
        }

         [AcceptVerbs("Get")]
         [Route("GetRolesUsersLists")]
        public IHttpActionResult GetRolesUsersLists()
        {
            //var result = _repo.GetRolesUsersLists();
            //return Ok(result);
            return Ok();
        }
        
         [AcceptVerbs("Get")]
         [Route("HasRole")]
         public async Task<IHttpActionResult> HasRole(string user,string role)
        {
            if (user == null)
                // return BadRequest("Invalid Username");
                return Ok(false);
            if (role == null)
                return Ok(false);
                //return BadRequest("Invalid Role");
            var result =await _repo.HasRole(user,role);
            return Ok(result);
        }
        
        [HttpPost]
        [Route("CreateRole")]
        public async Task<IHttpActionResult> CreateRole( string Role)
        {
            _repo = new AuthRepository();
            RoleViewModel rvm = new RoleViewModel() { Description = "Administrator Account", Name = Role};
            var result = await _repo.CreateRole(rvm);
            if (!result.Succeeded)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpPost]
        [Route("AddUserToRole")]
        public async Task<IHttpActionResult> AddUserToRole(string user, string role)
        {
            string dUser = null; ;
            try
            {
                dUser = _repo.FindUserByRole(user, role);
               // dUser = new ApplicationIdentityContext().UserBase.AsQueryable().ToList().Where(u => u.Organization == user).Select(d => d.Email).FirstOrDefault();
                //dUser = new AuthContext().UserBase.ToList().Where(u => u.Organization == user).Select(d => d.Email).FirstOrDefault();
            }
            catch (Exception ex)
            {
                dUser = user;
            }
            var userId = await _repo.FindUserByEmail(dUser);
            var result = await _repo.AddUserToRole(userId.Id, role);

            return Ok(result);
        }

        [HttpPost]
        [Route("RemoveUserFromRole")]
        public async Task<IHttpActionResult> RemoveUserFromRole(string role,string user)
        {
            //var userId = await _repo.FindUserByEmail(user);
            var result = await _repo.RemoveUserFromRole(user, role);

            return Ok(result);
        }
       
        
            [HttpPost]
            [Route("RequestAccountUpgrade")]
        public async Task<IHttpActionResult> RequestAccountUpgrade(string user, string role)
        {
            var userId = await _repo.FindUserByEmail(user);
            var result = await _repo.RequestAccountUpgrade(userId.Id, role);

            //_repo.AddUserToRole(userId.Id, role);

            return Ok(result);
        }
        [HttpPost]
        [Route("RemoveAllUserRole")]
        public async Task<IHttpActionResult> RemoveAllUserRole(string user)
        {
            var userId = await _repo.FindUserByEmail(user);
            var result = await _repo.ClearUserRoles(userId.Id);

            //_repo.AddUserToRole(userId.Id, role);

            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ResetPassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _repo.ResetPassword(model.Email, model.Code, model.Password);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("No user found. please check email");
                }
            }

            // If we got this far, something failed, redisplay form
            //return View(model);
            return BadRequest("Oops! Unknown Error");
        }


        [Route("VerifyCaptcha")]
        [HttpPost]
        public async Task<HttpResponseMessage> verifyCaptcha(string responses)
        {
            var secret = "6LcAlg0TAAAAABuPHEU8rncO7vBbLvjeraC270c1";
            var cli = new HttpClient();
            Uri resourceAddress = new Uri("https://www.google.com/recaptcha/api/siteverify?response=" + responses + "&secret=" + secret);
            cts = new CancellationTokenSource();
            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("secret", "6LcAlg0TAAAAABuPHEU8rncO7vBbLvjeraC270c1");
            pairs.Add("response", responses);
            // pairs.Add("grant_type", "password");
            //Http
            FormUrlEncodedContent formContent = new FormUrlEncodedContent(pairs);

            HttpResponseMessage response = await cli.PostAsync(resourceAddress, formContent);
            return response;
        }

        [Route("ChangePassword")]
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model, string set_email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //User.Identity.GetUserId()
            //UserModel mymodel = new UserModel();
            IdentityResult result = await _repo.ChangePassword(set_email, model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }


        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await _repo.SetPassword(User.Identity.GetUserId(), model.NewPassword);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }


        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            try
            {
                var baseUrl = Request.RequestUri.GetLeftPart(UriPartial.Authority);
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                IdentityResult result = await _repo.RegisterUser(userModel, baseUrl);

                IHttpActionResult errorResult = GetErrorResult(result);

                if (errorResult != null)
                {
                    return errorResult;
                }
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }


        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            string redirectUri = string.Empty;

            if (error != null)
            {
                return BadRequest(Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            var redirectUriValidationResult = ValidateClientAndRedirectUri(this.Request, ref redirectUri);

            if (!string.IsNullOrWhiteSpace(redirectUriValidationResult))
            {
                return BadRequest(redirectUriValidationResult);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            redirectUri = string.Format("{0}#external_access_token={1}&provider={2}&haslocalaccount={3}&external_user_name={4}",
                                            redirectUri,
                                            externalLogin.ExternalAccessToken,
                                            externalLogin.LoginProvider,
                                            hasRegistered.ToString(),
                                            externalLogin.UserName);

            return Redirect(redirectUri);

        }

        // POST api/Account/RegisterExternal
        [AllowAnonymous]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(model.Provider, model.ExternalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            //IdentityUser user = await _repo.FindAsync(new UserLoginInfo(model.Provider, verifiedAccessToken.user_id));

            ApplicationUser user = await _repo.FindAsync(new UserLoginInfo(model.Provider, verifiedAccessToken.user_id));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                return BadRequest("External user is already registered");
            }

            //user = new IdentityUser() { UserName = model.UserName };
            user = new ApplicationUser() { UserName = model.UserName };

            IdentityResult result = await _repo.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            var info = new ExternalLoginInfo()
            {
                DefaultUserName = model.UserName,
                Login = new UserLoginInfo(model.Provider, verifiedAccessToken.user_id)
            };

            result = await _repo.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(model.UserName);

            return Ok(accessTokenResponse);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ObtainLocalAccessToken")]
        public async Task<IHttpActionResult> ObtainLocalAccessToken(string provider, string externalAccessToken)
        {

            if (string.IsNullOrWhiteSpace(provider) || string.IsNullOrWhiteSpace(externalAccessToken))
            {
                return BadRequest("Provider or external access token is not sent");
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(provider, externalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(provider, verifiedAccessToken.user_id));

            bool hasRegistered = user != null;

            if (!hasRegistered)
            {
                return BadRequest("External user is not registered");
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(user.UserName);

            return Ok(accessTokenResponse);

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private string ValidateClientAndRedirectUri(HttpRequestMessage request, ref string redirectUriOutput)
        {

            Uri redirectUri;

            var redirectUriString = GetQueryString(Request, "redirect_uri");

            if (string.IsNullOrWhiteSpace(redirectUriString))
            {
                return "redirect_uri is required";
            }

            bool validUri = Uri.TryCreate(redirectUriString, UriKind.Absolute, out redirectUri);

            if (!validUri)
            {
                return "redirect_uri is invalid";
            }

            var clientId = GetQueryString(Request, "client_id");

            if (string.IsNullOrWhiteSpace(clientId))
            {
                return "client_Id is required";
            }

            var client = _repo.FindClient(clientId);

            if (client == null)
            {
                return string.Format("Client_id '{0}' is not registered in the system.", clientId);
            }

            if (!string.Equals(client.Result .AllowedOrigin, redirectUri.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
            {
                return string.Format("The given URL is not allowed by Client_id '{0}' configuration.", clientId);
            }

            redirectUriOutput = redirectUri.AbsoluteUri;

            return string.Empty;

        }

        private string GetQueryString(HttpRequestMessage request, string key)
        {
            var queryStrings = request.GetQueryNameValuePairs();

            if (queryStrings == null) return null;

            var match = queryStrings.FirstOrDefault(keyValue => string.Compare(keyValue.Key, key, true) == 0);

            if (string.IsNullOrEmpty(match.Value)) return null;

            return match.Value;
        }

        private async Task<ParsedExternalAccessToken> VerifyExternalAccessToken(string provider, string accessToken)
        {
            ParsedExternalAccessToken parsedToken = null;

            var verifyTokenEndPoint = "";

            if (provider == "Facebook")
            {
                //You can get it from here: https://developers.facebook.com/tools/accesstoken/
                //More about debug_tokn here: http://stackoverflow.com/questions/16641083/how-does-one-get-the-app-access-token-for-debug-token-inspection-on-facebook
                var appToken = "xxxxxx";
                verifyTokenEndPoint = string.Format("https://graph.facebook.com/debug_token?input_token={0}&access_token={1}", accessToken, appToken);
            }
            else if (provider == "Google")
            {
                verifyTokenEndPoint = string.Format("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={0}", accessToken);
            }
            else
            {
                return null;
            }

            var client = new HttpClient();
            var uri = new Uri(verifyTokenEndPoint);
            var response = await client.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                dynamic jObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(content);

                parsedToken = new ParsedExternalAccessToken();

                if (provider == "Facebook")
                {
                    parsedToken.user_id = jObj["data"]["user_id"];
                    parsedToken.app_id = jObj["data"]["app_id"];

                    if (!string.Equals(Startup.facebookAuthOptions.AppId, parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }
                }
                else if (provider == "Google")
                {
                    parsedToken.user_id = jObj["user_id"];
                    parsedToken.app_id = jObj["audience"];

                    if (!string.Equals(Startup.googleAuthOptions.ClientId, parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }

                }

            }

            return parsedToken;
        }

        private JObject GenerateLocalAccessTokenResponse(string userName)
        {

            var tokenExpiration = TimeSpan.FromDays(1);

            ClaimsIdentity identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.Name, userName));
            identity.AddClaim(new Claim("role", "user"));

            var props = new AuthenticationProperties()
            {
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
            };

            var ticket = new AuthenticationTicket(identity, props);

            var accessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);

            JObject tokenResponse = new JObject(
                                        new JProperty("userName", userName),
                                        new JProperty("access_token", accessToken),
                                        new JProperty("token_type", "bearer"),
                                        new JProperty("expires_in", tokenExpiration.TotalSeconds.ToString()),
                                        new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                                        new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
        );

            return tokenResponse;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }
            public string ExternalAccessToken { get; set; }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer) || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name),
                    ExternalAccessToken = identity.FindFirstValue("ExternalAccessToken"),
                };
            }
        }

        #endregion

       
    }
}

