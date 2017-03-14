using AspNetIdentityMongoWebAPI.API.Entities;
using AspNetIdentityMongoWebAPI.API.Models;
using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Data.Entity.Infrastructure;
using AspNetIdentityMongoWebAPI.API.Context;
using AspNetIdentityMongoWebAPI.API.App_Start;
using Microsoft.AspNet.Identity.Owin;
using AspNet.Identity.MongoDB;
using Microsoft.Owin;
using MongoDB.Bson;
using MongoDB.Driver;

namespace AspNetIdentityMongoWebAPI.API.Repository
{


    public class AuthRepository : IDisposable
    {
        // private AuthContext _ctx;
       //public ApplicationIdentityContext _ctx;

        public ApplicationIdentityContext _ctx
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<ApplicationIdentityContext>();
                //return HttpContext.GetOwinContext().GetUserManager<ApplicationIdentityContext>();
            }
        }
        // private UserManager<IdentityUser> _userManager;
        //private UserManager<ApplicationUser> _userManager;
        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _rm;

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _rm ?? HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _rm = value;
            }
        }


        public AuthRepository()
        {
            // _ctx = new AuthContext();
            
            //_ctx.Configuration.ProxyCreationEnabled = false;

            //_userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(_ctx));
            _userManager = UserManager;
            //_rm = new ApplicationRoleManager(new RoleStore<ApplicationRole>(_ctx));
            _rm = RoleManager;
            //_ctx = new ApplicationIdentityContext(); //ctx;
        }

        public static string GetUserConfirmationRedirectUrl(string code, string userId,string BaseURL)
        {   
            dynamic absoluteUri = BaseURL+ "/#/Confirm?code=" + HttpUtility.UrlEncode(code) + "&userId=" + HttpUtility.UrlEncode(userId);
            return absoluteUri;
        }
        public static string GetUserCreationConfirmationRedirectUrl(string code, string userId,string BaseURL)
        {
            dynamic absoluteUri =BaseURL+ "/#/Confirm?code=" + HttpUtility.UrlEncode(code) + "&userId=" + HttpUtility.UrlEncode(userId);
            return absoluteUri;
        }
        public async Task<IdentityResult> RegisterUser(UserModel userModel,string URL)
        {
            var user = new ApplicationUser() {
                UserName = userModel.UserName, 
                Email = userModel.UserName
                //,
                //Address =userModel .Address,
                //City =userModel .City ,
                //FirstName =userModel .FirstName ,
                //LastName =userModel .LastName ,
                //PostalCode =userModel .PostalCode ,
                //State=userModel.State 
            };
            var result = await _userManager.CreateAsync(user, userModel.Password);
            if (result.Succeeded)
            {
                var email = user.Email;
                if (await AddUserDetails(userModel, email) > 0)
                {

                    //var provider = new Microsoft.Owin.Security.DataProtection.DpapiDataProtectionProvider("VBV3");
                    //_userManager.UserTokenProvider = new Microsoft.AspNet.Identity.Owin.DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));

                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    //var callbackUrl = GetUserCreationConfirmationRedirectUrl(code, user.Id, URL);


                    //var callbackUrl = Url.Action(
                    //   "ConfirmEmail", "Account",
                    //   new { userId = user.Id, code = code },
                    //   protocol: Request.Url.Scheme);

                   // await _userManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>");
                
                    return result;
                }
                else
                {
                    return new IdentityResult("User already existed ", "unable to update users profile");
                }// ViewBag.Link = callbackUrl;   // Used only for initial demo.
                //return result;

            }
            else
            {
                return result;
            }
            
        }

        //private bool AdUserDetailsExists(string id)
        //{
        //    return _ctx.UserBase.Count(e => e.Id == id) > 0;
        //}
        public async Task<int> AddUserDetails(UserModel user, string userName)
        {
            var userb = await FindUser(userName, user.Password);
            UserBase ubase = new UserBase()
            {
                Address = user.Address,
                City = user.City,
                Email = userb.Email,
                FirstName = user.FirstName,
                FullName = user.FirstName + " " + user.LastName,
                Id = userb.Id,
                LastName = user.LastName,
                MiddleName = user.MiddleName,
                Organization = user.Organization,
                PostalCode = user.PostalCode,
                State = user.State,
                regDate=DateTime .Now 
            };
           
        //    _ctx.UserBase.Add(ubase);
            
            try
            {
                UserBaseRepository ubaseRepo = new UserBaseRepository();
                ubaseRepo.Add(ubase);
                return 1;// _userBase.Collection.Save(); //_ctx.SaveChanges();
            }
            catch (DbUpdateException)
            {
                return -1;
                //if (AdUserDetailsExists(ubase.Id))
                //{
                //    return -1;
                //}
                //else
                //{
                //    return 0;
                //    //throw;
                //}
            }


        }

        public async Task<bool> ForgotPassword(string email,string URL)
        {
            var user = await FindUserByEmail(email);
            var mailConfirmed = await IsMailConfirmed(email);
            //if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
            if (user == null || !(mailConfirmed))
            {
                return false;
            }
            string code = await _userManager.GeneratePasswordResetTokenAsync(user.Id);
            //var callbackUrl = GetUserConfirmationRedirectUrl(code, user.Id, Request);
            var callbackUrl = GetUserConfirmationRedirectUrl(code,user.Id,URL);
            //Url.Encode(Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme));
            await _userManager.SendEmailAsync(user.Id, "ResetPassword", "Please reset your password by clicking here: <a href=\"" + callbackUrl + "\">link</a>");
            //SendEmail(user.Email, callbackUrl, "ResetPassword", "Please reset your password by clicking here");
            // return RedirectToAction("ForgotPasswordConfirmation", "Account");
            return true;
        }

        public async Task<bool> ResetPassword(string email,string Code,string Password)
        {
            var user = await FindUserByEmail(email);
           // var user = await _userManager.FindByNameAsync(email);
            if (user == null)
            {
                return false;
            }
            IdentityResult result = await _userManager.ResetPasswordAsync(user.Id, Code, Password);
            if (result.Succeeded)
            {
                return true;
                // return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            else
            {
                return false;
            }
           // return false;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await _userManager.FindAsync(userName, password);

            return user;
        }

        public string FindUserByRole(string org, string role)
        {
            try
            {
                var value = _ctx.UserBase.AsQueryable().ToList();
                if(value .Count > 0)
                {
                    var result = value.Where(u => u.Organization == org).Select(d => d.Email).FirstOrDefault();
                    return result;
                }else
                {
                    return org;
                    //throw new NullReferenceException();
                }
                
            }
            catch (ArgumentNullException ea) {
                //return null;
                return org;
            }
            catch (Exception ex)
            {
                return null;
                //throw new NullReferenceException() ;
            }
         
        }

        public async Task<ApplicationUser> FindUserById(string UserId){
            var user = await _userManager.FindByIdAsync(UserId);
            return user;
        }

        public async Task<ApplicationUser> FindUserByEmail(string UserMail)
        {
            var user = await _userManager.FindByEmailAsync(UserMail);
            return user;
        }

        public async Task<bool> IsMailConfirmed(string UserMail)
        {
            var userId =await FindUserByEmail(UserMail);
            if (userId == null)
            {
                return false;
            }
            var user = await _userManager.IsEmailConfirmedAsync(userId.Email);
            return user;
        }

        //public async Task<bool> ConfirmCode(ConfirmCodeModel model)
        public async Task<IdentityResult> ConfirmCode(ConfirmCodeModel model)
        {
            var result =await _userManager.ConfirmEmailAsync(model.userId, model.code);
            return result;
        }

        //public Client FindClient(string clientId)
        //{
        //    var client = _ctx.Clients.Find(clientId);
        //    return client;
        //}

        public async  Task<Client> FindClient(string clientId)
        {
            FindOptions<Client> options = new FindOptions<Client> { Limit = 1 };
            IAsyncCursor<Client> task = await _ctx.Clients.FindAsync(x => x.Id.Equals(clientId ), options);
            List<Client> list = await task.ToListAsync();
            Client result = list.FirstOrDefault();
            return result;
           
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

            //var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            FindOptions<RefreshToken> options = new FindOptions<RefreshToken> { Limit = 1 };
            IAsyncCursor<RefreshToken> task = await _ctx.RefreshTokens.FindAsync(x => x.Subject.Equals(token.Subject ) && x.ClientId.Equals(token.ClientId), options);
            List<RefreshToken> list = await task.ToListAsync();
            RefreshToken existingToken = list.FirstOrDefault();
            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            //_ctx.RefreshTokens.Add(token);
            try
            {
                _ctx.RefreshTokens.InsertOne(token);
                return true;
            }catch
            {
                return false;
            }
           

            //return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            //var builder = Builders<RefreshToken>.Filter;
            //var filter = builder.Eq("ClientId", refreshTokenId );
            //filter = filter & builder.Eq("EstablishedYear", 1349);

            FindOptions<RefreshToken> options = new FindOptions<RefreshToken> { Limit = 1 };
            IAsyncCursor<RefreshToken> task = await _ctx.RefreshTokens.FindAsync(x => x.ClientId.Equals(refreshTokenId), options);
            List<RefreshToken> list = await task.ToListAsync();
            RefreshToken refreshToken = list.FirstOrDefault();
            //var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId );

            if (refreshToken != null) {
                //_ctx.RefreshTokens.Remove(refreshToken);
                //return await _ctx.SaveChangesAsync() > 0;
                try
                {
                    await _ctx.RefreshTokens.DeleteOneAsync(x => x.ClientId.Equals(refreshTokenId));
                    return true;
                }
                catch
                {
                    return false;
                }
           }

           return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            try
            {
                await _ctx.RefreshTokens.DeleteOneAsync(x => x.ClientId.Equals(refreshToken.ClientId ));
                return true;
            }
            catch
            {
                return false;
            }
           // _ctx.RefreshTokens.Remove(refreshToken);
             //return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            FindOptions<RefreshToken> options = new FindOptions<RefreshToken> { Limit = 1 };
            IAsyncCursor<RefreshToken> task = await _ctx.RefreshTokens.FindAsync(x => x.ClientId.Equals(refreshTokenId), options);
            List<RefreshToken> list = await task.ToListAsync();
            RefreshToken refreshToken = list.FirstOrDefault();

            return refreshToken;
        }

        public async Task<List<RefreshToken>> GetAllRefreshTokens()
        {

            //IAsyncCursor<RefreshToken> task = await _ctx.RefreshTokens.Find(_ => true).ToListAsync();
            //List<RefreshToken> list = await task.ToListAsync();
            //RefreshToken refreshToken = list.FirstOrDefault();
            //return _ctx.RefreshTokens.ToList();
            return await _ctx.RefreshTokens.Find(_ => true).ToListAsync();
        }

        //public async Task<IdentityUser> FindAsync(UserLoginInfo loginInfo)
        //{
        //    IdentityUser user = await _userManager.FindAsync(loginInfo);

        //    return user;
        //}

        public bool RoleExists(string name)
        {
            return _rm.RoleExists(name);
        }

        public async Task<bool> HasRole(string user,string role){
            var rUser=await _userManager.FindByEmailAsync (user);
            if(rUser.UserName   !=null){
                if (RoleExists(role) != false)
                {
                    return await _userManager.IsInRoleAsync(rUser.Id, role);
                }
            }
            return false;
        }


        public async Task<IdentityResult > CreateRole(RoleViewModel  model)
        {
            var role = new ApplicationRole(model.Name );
            role.Description = model.Description;
            var roleresult = await _rm.CreateAsync(role);
            return roleresult;
            //return idResult.Succeeded;
        }

        public async Task<IdentityResult > AddUserToRole(string userId, string roleName)
        {
            //var um = new UserManager<ApplicationUser>(
            //    new UserStore<ApplicationUser>(new AuthContext()));
            //var um = new ApplicationUserManager(new UserStore<ApplicationUser>(new AuthContext()));
            var idResult =await _userManager.AddToRoleAsync(userId, roleName);
            return idResult;
            //return idResult.Succeeded;
        }

        public async Task<IdentityResult > editrole(RoleViewModel roleModel)
        {
            var role = await _rm.FindByIdAsync(roleModel.Id);
            role.Name = roleModel.Name;
            // Update the new Description property:
            //role.Description = roleModel.Description;
            var result=await _rm.UpdateAsync(role);
            return result;
        }

        public async Task<IdentityResult > ClearUserRoles(string userId)
        {
            List<string> results=new List<string>();
            IdentityResult tempResult=new IdentityResult ();
            //var um = new UserManager<ApplicationUser>(
            //    new UserStore<ApplicationUser>(new AuthContext()));
             //var um = new ApplicationUserManager(new UserStore<ApplicationUser>(new AuthContext()));
            var user = _userManager.FindById(userId);
            //var currentRoles = new List<IdentityUserRole>();
            var currentRoles = new List<string>();
            currentRoles.AddRange(user.Roles);
            foreach (var role in currentRoles)
            {
                try
                {
                    var drole = await _rm.FindByIdAsync(role);//role.RoleId);
                    var roleName = drole.Name;
                    //um.RemoveFromRole(userId, role.Role.Name);
                    var result = _userManager.RemoveFromRole(userId, roleName);
                    results.Add("success");
                    IdentityResult iresult = new IdentityResult(results);
                    tempResult = iresult;
                    //return iresult;
                }
                catch (Exception ex)
                {
                    results.Add(ex.Message);
                    IdentityResult iresult = new IdentityResult(results );
                    tempResult = iresult;
                    //return iresult;
                }
            }
            return tempResult;
        }
        public async Task<IdentityResult> RemoveUserFromRole(string userId, string role)
        {
            //var role = await _rm.FindByIdAsync(role);
            var result = await _userManager.RemoveFromRoleAsync(userId, role);
            return result;
        }

        public IQueryable<ApplicationUser> GetAllAppUsers()
        {
            var result = _userManager.Users;
            return result;

        }

        public IQueryable<Object> GetAllUsers()
        {
            //var result = _ctx .UserBase.Join (_ctx.Users ,a=>a.Email ,b=>b.Email ,(a,b)=>new {a,b}).AsQueryable () ;
            //var result = _ctx.Users.Where(e => e.UserBase.Any());
            var result = _ctx.UserBase.AsQueryable ().Join(_ctx.Users.AsQueryable()  ,a=>a.Email ,b=>b.Email ,(a,b)=>new {
                a.Address ,
                a.City ,
                a.Email ,
                a.FirstName ,
                a.FullName ,
                a.Id ,
                a.LastName,a.Organization ,a.PostalCode ,a.regDate ,b.PhoneNumber ,b.Roles });
            return result;

        }

        public IQueryable<object> GetUserDetails(string user)
        {
            var result = _ctx.UserBase.AsQueryable() .Join(_ctx.Users.AsQueryable (), a => a.Email, b => b.Email, (a, b) => new
            {
                a.Address,
                a.City,
                a.Email,
                a.FirstName,
                a.FullName,
                a.Id,
                a.LastName,
                a.Organization,
                a.PostalCode,
                a.regDate,
                b.PhoneNumber,
                b.Roles
            }).Where (u=>u.Email ==user);
            return result;
        }


        //public List <UserBase > GetAllUsersList()
        public IEnumerable<string > GetAllUsersList()
        {
            var result = _ctx.UserBase.AsQueryable().ToList().Select(u => u.Organization);
                return result;
            
            
        }

        public async Task< IEnumerable<string>> GetUsersRoles(string user)
        {
            List<string> item=null;
            var userId=await _userManager .FindByEmailAsync (user);
            var roles = GetAllRoles().ToList ().Select (u=>u.Name ).ToList ();
            foreach (var d in roles){
                var result =await _userManager.IsInRoleAsync(userId.Id , d);
                if (result == true)
                    item.Add(d);
            }
            return item;
        }

        //public IQueryable<ApplicationRole> GetAllRoles()
        public IQueryable<IdentityRole> GetAllRoles()
        {
            var result = _rm.Roles;
            return result;

        }

        public IEnumerable <string> GetAllRolesList()
        {
            var result = _rm.Roles.AsQueryable().ToList ().Select (u=>u.Name );
            return result;

        }

        public async Task <int> RequestAccountUpgrade(string type,string user)
        {
            var users=_ctx .UserBase.AsQueryable ().Where (u=>u.Email ==user).Select (u=>u).FirstOrDefault ();
            UpgradeRequest request = new UpgradeRequest()
            {
                Organization = users.Organization,
                role = type,
                UserId = users.Id
            };
            //var result = _ctx.UpgradeRequest.Add(request);

            try
            {
                //int response = await _ctx.SaveChangesAsync();
                //return response;
                await _ctx.UpgradeRequest.InsertOneAsync(request);
                return 1;
            }
            catch (DbUpdateException)
            {
                throw;
            }
            
            
        }

        public async Task<ApplicationUser> FindAsync(UserLoginInfo loginInfo)
        {
            ApplicationUser user = await _userManager.FindAsync(loginInfo);

            return user;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user)// IdentityUser user)
        {
            var result = await _userManager.CreateAsync(user);

            return result;
        }

        public async Task<IdentityResult> AddLoginAsync(string userId, UserLoginInfo login)
        {
            var result = await _userManager.AddLoginAsync(userId, login);

            return result;
        }

        public async Task<IdentityResult> SetPassword(string userId,string Password){
            var result=await _userManager.AddPasswordAsync(userId,Password);
            return result;
        }

        public async Task<IdentityResult> ChangePassword(string userId,string OldPassword, string Password)
        {
            var result = await _userManager.ChangePasswordAsync(userId,OldPassword, Password);
            return result;
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}