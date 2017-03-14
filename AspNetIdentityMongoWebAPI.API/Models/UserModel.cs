using AspNetIdentityMongoWebAPI.API.Context;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AspNetIdentityMongoWebAPI.API.Models
{

    //public class UserList :
    //    UserBase
    //{
    //    public string PhoneNumber { get; set; }
    //}
    

    public class UpgradeRequest
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Organization { get; set; }
        public string UserId { get; set; }
        public string role { get; set; }
    }
    public class UserModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        //[Required ]
        public string FirstName{get; set;}

        //[Required ]
        public string LastName{get; set;}

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }



        // Use a sensible display name for views:

        [Display(Name = "Postal Code")]

        public string PostalCode { get; set; }


        public ApplicationUser GetUser()
        {
            var user = new ApplicationUser()
            {
                UserName = this.UserName
                //,
                //FirstName = this.FirstName,
                //LastName = this.LastName,
                //Address =this .Address ,
                //City=this .City,
                //State =this.State 
                //Email = this.Email,
            };
            return user;
        }

        public string MiddleName { get; set; }

        public string Organization { get; set; }

        public DateTime regDate { get; set; }
    }

    public class RoleViewModel
    {
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "RoleName")]
        public string Name { get; set; }
        public string Description { get; set; }

    }

    public class SetPasswordBindingModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class ResetPasswordModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }

    public class ConfirmCodeModel
    {
        [Required]
        public string code { get; set; }
        public string userId { get; set; }
    }

    // public class SelectUserRolesViewModel
    //{
    //    public SelectUserRolesViewModel() 
    //    {
    //        this.Roles = new List<SelectRoleEditorViewModel>();
    //    }
  
  
    //    // Enable initialization with an instance of ApplicationUser:
    //    public SelectUserRolesViewModel(ApplicationUser user) : this()
    //    {
    //        this.UserName = user.UserName;
    //        this.FirstName = user.FirstName;
    //        this.LastName = user.LastName;
  
    //        var Db = new AuthContext ();
  
    //        // Add all available roles to the list of EditorViewModels:
    //        var allRoles = Db.Roles;
    //        foreach(var role in allRoles)
    //        {
    //            // An EditorViewModel will be used by Editor Template:
    //            var rvm = new SelectRoleEditorViewModel(role);
    //            this.Roles.Add(rvm);
    //        }
  
    //        // Set the Selected property to true for those roles for 
    //        // which the current user is a member:
    //        foreach(var userRole in user.Roles)
    //        {
    //            var checkUserRole = 
    //                this.Roles.Find(r => r.RoleName == userRole.Role.Name);
    //            checkUserRole.Selected = true;
    //        }
    //    }
  
    //    public string UserName { get; set; }
    //    public string FirstName { get; set; }
    //    public string LastName { get; set; }
    //    public List<SelectRoleEditorViewModel> Roles { get; set; }
    //}
  
    // Used to display a single role with a checkbox, within a list structure:
    public class SelectRoleEditorViewModel
    {
        public SelectRoleEditorViewModel() {}
        public SelectRoleEditorViewModel(IdentityRole role)
        {
            this.RoleName = role.Name;
        }
  
        public bool Selected { get; set; }
  
        [Required]
        public string RoleName { get; set;}
    }


}