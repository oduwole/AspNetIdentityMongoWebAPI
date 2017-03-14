using AspNet.Identity.MongoDB;
using AspNetIdentityMongoWebAPI.API.App_Start;
using AspNetIdentityMongoWebAPI.API.Context;
using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AspNetIdentityMongoWebAPI.API
{

    /// <summary>
    ///  Uncomment for EntityFramework SQL SERVER Identity
    /// </summary>
    //public class ApplicationUserManager : UserManager<ApplicationUser>
    //{
    //    /// <summary>
    //    ///
    //    /// </summary>
    //    /// <param name="store"></param>
    //    public ApplicationUserManager(IUserStore<ApplicationUser> store)
    //        : base(store)
    //    {
    //    }

    //    public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
    //    {
    //        //var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
    //        var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<AuthContext>()));
    //        // Configure validation logic for usernames
    //        manager.UserValidator = new UserValidator<ApplicationUser>(manager)
    //        {
    //            AllowOnlyAlphanumericUserNames = false,
    //            RequireUniqueEmail = true
    //        };
    //        // Configure validation logic for passwords
    //        manager.PasswordValidator = new PasswordValidator
    //        {
    //            RequiredLength = 6,
    //            RequireNonLetterOrDigit = true,
    //            RequireDigit = true,
    //            RequireLowercase = true,
    //            RequireUppercase = true,
    //        };

    //        manager.RegisterTwoFactorProvider("PhoneCode", new PhoneNumberTokenProvider<ApplicationUser>
    //        {MessageFormat = "Your security code is: {0}"});
    //    manager.RegisterTwoFactorProvider("EmailCode", new EmailTokenProvider< ApplicationUser>
    //    {Subject = "SecurityCode",BodyFormat = "Your security code is: {0}"});
    //    manager.EmailService = new EmailService();
    //    manager.SmsService = new SmsService();
    //        var dataProtectionProvider = options.DataProtectionProvider;
    //        if (dataProtectionProvider != null)
    //        {
    //            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("TestAPI"));
    //        }
    //        return manager;
    //    }
    //}

    //public class ApplicationRoleManager : RoleManager<ApplicationRole>
    //{
    //    public ApplicationRoleManager(IRoleStore<ApplicationRole, string> roleStore)
    //        : base(roleStore)
    //    {

    //    }

    //    public static ApplicationRoleManager Create(IdentityFactoryOptions<ApplicationRoleManager> options, IOwinContext context)
    //    {
    //        var rManager = new ApplicationRoleManager(new RoleStore<ApplicationRole>(context.Get<AuthContext>()));
    //        return rManager;
    //        //return new ApplicationRoleManager(new RoleStore<ApplicationRole>(context.Get<AuthContext >()));

    //    }

    //}

    //public class EmailService : IIdentityMessageService
    //{
        

    //    // As Task
    //    public void sendMail(Message message)
    //    {

    //        //#region formatter
    //        string text = string.Format("Please click on this link to {0}: {1}", message.Subject, message.Body);
    //        string html = "Please confirm your account by clicking this link: <a href=\\" + message.Body + " \\ \">link</a><br/>";
    //        html += "Or click on the copy the following link on the browser:" + message.Body;
    //        //#endregion

    //        MailMessage msg = new MailMessage();
    //        msg.From = new MailAddress("segxy2708@hotmail.com");
    //        msg.To.Add(new MailAddress(message.Destination));
    //        msg.Subject = message.Subject;
    //        msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
    //        msg.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(html, null, MediaTypeNames.Text.Html));


    //        SmtpClient smtpClient = new SmtpClient("smtp.live.com", 587);
    //        //("smtp.gmail.com", Convert.ToInt32(587))
    //        //NetworkCredential credentials = new NetworkCredential("{{email}}", "{{password}}");
    //        NetworkCredential credentials = new NetworkCredential("{{email}}", "{{password}}"); 
    //        smtpClient.Credentials = credentials;
    //        smtpClient.EnableSsl = true;

    //        smtpClient.SendCompleted += SendCompletedCallback;
    //        string userState = " Account Creation";
    //        smtpClient.SendAsync(msg, userState);
    //    }


        

    //    public Task SendAsync(IdentityMessage message)
    //    {
    //        // convert IdentityMessage to a MailMessage
    //        var email =
    //           new MailMessage(new MailAddress("segxy2708@hotmail.com", "(do not reply)"),
    //           new MailAddress(message.Destination))
    //           {
    //               Subject = message.Subject,
    //               Body = message.Body,
    //               IsBodyHtml = true
    //           };

    //        using (var client = new SmtpClient("smtp.live.com", 587) {
    //            Credentials = new NetworkCredential("{{email}}", "{{password}}")//,
    //          //  EnableSsl = true
    //        }) // SmtpClient configuration comes from config file
    //        {
    //            return client.SendMailAsync(email);
    //        }
    //    }

    //    private static bool mailSent = false;
        

    //    private static void SendCompletedCallback(object sender, AsyncCompletedEventArgs e)
    //    {
    //        // Get the unique identifier for this asynchronous operation.
    //        String token = (string)e.UserState;

    //        if (e.Cancelled)
    //        {
    //            Console.WriteLine("[{0}] Send canceled.", token);
    //        }
    //        if (e.Error != null)
    //        {
    //            Console.WriteLine("[{0}] {1}", token, e.Error.ToString());
    //        }
    //        else
    //        {
    //            Console.WriteLine("Message sent.");
    //        }
    //        mailSent = true;
    //    }

       
    //}

    //public class Message
    //{
    //    public string Subject { get; set; }
    //    public string Body { get; set; }
    //    public string Destination { get; set; }
    //}
    //public class SmsService : IIdentityMessageService
    //{
    //    public Task SendAsync(IdentityMessage message)
    //    {
    //        // Plug in your sms service here to send a text message.
    //        //dynamic twillio = new Twilio.TwilioRestClient("", "");
    //        //dynamic result = twillio.SendSmsMessage("", "", "");

    //        return Task.FromResult(0);
    //    }
    //}



    
        // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.

        public class ApplicationUserManager : UserManager<ApplicationUser>
        {
            public ApplicationUserManager(IUserStore<ApplicationUser> store)
                : base(store)
            {
            }

            public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
            {
                var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationIdentityContext>().Users));
                // Configure validation logic for usernames
                manager.UserValidator = new UserValidator<ApplicationUser>(manager)
                {
                    AllowOnlyAlphanumericUserNames = false,
                    RequireUniqueEmail = true
                };
                // Configure validation logic for passwords
                manager.PasswordValidator = new PasswordValidator
                {
                    RequiredLength = 6,
                    RequireNonLetterOrDigit = true,
                    RequireDigit = true,
                    RequireLowercase = true,
                    RequireUppercase = true,
                };
                // Configure user lockout defaults
                manager.UserLockoutEnabledByDefault = true;
                manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
                manager.MaxFailedAccessAttemptsBeforeLockout = 5;
                // Register two factor authentication providers. This application uses Phone and Emails as a step of receiving a code for verifying the user
                // You can write your own provider and plug in here.
                manager.RegisterTwoFactorProvider("PhoneCode", new PhoneNumberTokenProvider<ApplicationUser>
                {
                    MessageFormat = "Your security code is: {0}"
                });
                manager.RegisterTwoFactorProvider("EmailCode", new EmailTokenProvider<ApplicationUser>
                {
                    Subject = "SecurityCode",
                    BodyFormat = "Your security code is {0}"
                });
                manager.EmailService = new EmailService();
                manager.SmsService = new SmsService();
                var dataProtectionProvider = options.DataProtectionProvider;
                if (dataProtectionProvider != null)
                {
                    manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
                }
                return manager;
            }

            /// <summary>
            /// Method to add user to multiple roles
            /// </summary>
            /// <param name="userId">user id</param>
            /// <param name="roles">list of role names</param>
            /// <returns></returns>
            public virtual async Task<IdentityResult> AddUserToRolesAsync(string userId, IList<string> roles)
            {
                var userRoleStore = (IUserRoleStore<ApplicationUser, string>)Store;

                var user = await FindByIdAsync(userId).ConfigureAwait(false);
                if (user == null)
                {
                    throw new InvalidOperationException("Invalid user Id");
                }

                var userRoles = await userRoleStore.GetRolesAsync(user).ConfigureAwait(false);
                // Add user to each role using UserRoleStore
                foreach (var role in roles.Where(role => !userRoles.Contains(role)))
                {
                    await userRoleStore.AddToRoleAsync(user, role).ConfigureAwait(false);
                }

                // Call update once when all roles are added
                return await UpdateAsync(user).ConfigureAwait(false);
            }

            /// <summary>
            /// Remove user from multiple roles
            /// </summary>
            /// <param name="userId">user id</param>
            /// <param name="roles">list of role names</param>
            /// <returns></returns>
            public virtual async Task<IdentityResult> RemoveUserFromRolesAsync(string userId, IList<string> roles)
            {
                var userRoleStore = (IUserRoleStore<ApplicationUser, string>)Store;

                var user = await FindByIdAsync(userId).ConfigureAwait(false);
                if (user == null)
                {
                    throw new InvalidOperationException("Invalid user Id");
                }

                var userRoles = await userRoleStore.GetRolesAsync(user).ConfigureAwait(false);
                // Remove user to each role using UserRoleStore
                foreach (var role in roles.Where(userRoles.Contains))
                {
                    await userRoleStore.RemoveFromRoleAsync(user, role).ConfigureAwait(false);
                }

                // Call update once when all roles are removed
                return await UpdateAsync(user).ConfigureAwait(false);
            }
        }

        // Configure the RoleManager used in the application. RoleManager is defined in the ASP.NET Identity core assembly
        public class ApplicationRoleManager : RoleManager<ApplicationRole>
        {
        public ApplicationRoleManager(IRoleStore<ApplicationRole, string> roleStore)
            : base(roleStore)
        {
        }


        //    public ApplicationRoleManager(IQueryableRoleStore<IdentityRole> roleStore)
        //    :base(roleStore)
        //{

        //}
        public static ApplicationRoleManager Create(IdentityFactoryOptions<ApplicationRoleManager> options, IOwinContext context)
            {
                var manager = new ApplicationRoleManager(new RoleStore<ApplicationRole>(context.Get<ApplicationIdentityContext>().Roles));

                return manager;
            }

    }

   

        public class EmailService : IIdentityMessageService
        {
            public Task SendAsync(IdentityMessage message)
            {
                // Plug in your email service here to send an email.
                return Task.FromResult(0);
            }
        }

        public class SmsService : IIdentityMessageService
        {
            public Task SendAsync(IdentityMessage message)
            {
                // Plug in your sms service here to send a text message.
                return Task.FromResult(0);
            }
        }

        public enum SignInStatus
        {
            Success,
            LockedOut,
            RequiresTwoFactorAuthentication,
            Failure
        }

        // These help with sign and two factor (will possibly be moved into identity framework itself)
        public class SignInHelper
        {
            public SignInHelper(ApplicationUserManager userManager, IAuthenticationManager authManager)
            {
                UserManager = userManager;
                AuthenticationManager = authManager;
            }

            public ApplicationUserManager UserManager { get; private set; }
            public IAuthenticationManager AuthenticationManager { get; private set; }

            public async Task SignInAsync(ApplicationUser user, bool isPersistent, bool rememberBrowser)
            {
                // Clear any partial cookies from external or two factor partial sign ins
                AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie, DefaultAuthenticationTypes.TwoFactorCookie);
                var userIdentity = await user.GenerateUserIdentityAsync(UserManager);
                if (rememberBrowser)
                {
                    var rememberBrowserIdentity = AuthenticationManager.CreateTwoFactorRememberBrowserIdentity(user.Id);
                    AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity, rememberBrowserIdentity);
                }
                else
                {
                    AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity);
                }
            }

            public async Task<bool> SendTwoFactorCode(string provider)
            {
                var userId = await GetVerifiedUserIdAsync();
                if (userId == null)
                {
                    return false;
                }

                var token = await UserManager.GenerateTwoFactorTokenAsync(userId, provider);
                // See IdentityConfig.cs to plug in Email/SMS services to actually send the code
                await UserManager.NotifyTwoFactorTokenAsync(userId, provider, token);
                return true;
            }

            public async Task<string> GetVerifiedUserIdAsync()
            {
                var result = await AuthenticationManager.AuthenticateAsync(DefaultAuthenticationTypes.TwoFactorCookie);
                if (result != null && result.Identity != null && !String.IsNullOrEmpty(result.Identity.GetUserId()))
                {
                    return result.Identity.GetUserId();
                }
                return null;
            }

            public async Task<bool> HasBeenVerified()
            {
                return await GetVerifiedUserIdAsync() != null;
            }

            public async Task<SignInStatus> TwoFactorSignIn(string provider, string code, bool isPersistent, bool rememberBrowser)
            {
                var userId = await GetVerifiedUserIdAsync();
                if (userId == null)
                {
                    return SignInStatus.Failure;
                }
                var user = await UserManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return SignInStatus.Failure;
                }
                if (await UserManager.IsLockedOutAsync(user.Id))
                {
                    return SignInStatus.LockedOut;
                }
                if (await UserManager.VerifyTwoFactorTokenAsync(user.Id, provider, code))
                {
                    // When token is verified correctly, clear the access failed count used for lockout
                    await UserManager.ResetAccessFailedCountAsync(user.Id);
                    await SignInAsync(user, isPersistent, rememberBrowser);
                    return SignInStatus.Success;
                }
                // If the token is incorrect, record the failure which also may cause the user to be locked out
                await UserManager.AccessFailedAsync(user.Id);
                return SignInStatus.Failure;
            }

            public async Task<SignInStatus> ExternalSignIn(ExternalLoginInfo loginInfo, bool isPersistent)
            {
                var user = await UserManager.FindAsync(loginInfo.Login);
                if (user == null)
                {
                    return SignInStatus.Failure;
                }
                if (await UserManager.IsLockedOutAsync(user.Id))
                {
                    return SignInStatus.LockedOut;
                }
                return await SignInOrTwoFactor(user, isPersistent);
            }

            private async Task<SignInStatus> SignInOrTwoFactor(ApplicationUser user, bool isPersistent)
            {
                if (await UserManager.GetTwoFactorEnabledAsync(user.Id) &&
                    !await AuthenticationManager.TwoFactorBrowserRememberedAsync(user.Id))
                {
                    var identity = new ClaimsIdentity(DefaultAuthenticationTypes.TwoFactorCookie);
                    identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));
                    AuthenticationManager.SignIn(identity);
                    return SignInStatus.RequiresTwoFactorAuthentication;
                }
                await SignInAsync(user, isPersistent, false);
                return SignInStatus.Success;

            }

            public async Task<SignInStatus> PasswordSignIn(string userName, string password, bool isPersistent, bool shouldLockout)
            {
                var user = await UserManager.FindByNameAsync(userName);
                if (user == null)
                {
                    return SignInStatus.Failure;
                }
                if (await UserManager.IsLockedOutAsync(user.Id))
                {
                    return SignInStatus.LockedOut;
                }
                if (await UserManager.CheckPasswordAsync(user, password))
                {
                    return await SignInOrTwoFactor(user, isPersistent);
                }
                if (shouldLockout)
                {
                    // If lockout is requested, increment access failed count which might lock out the user
                    await UserManager.AccessFailedAsync(user.Id);
                    if (await UserManager.IsLockedOutAsync(user.Id))
                    {
                        return SignInStatus.LockedOut;
                    }
                }
                return SignInStatus.Failure;
            }
        }

}
