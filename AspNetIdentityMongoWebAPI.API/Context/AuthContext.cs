using AspNetIdentityMongoWebAPI.API.Entities;
using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using AspNetIdentityMongoWebAPI.API.Models;
using System.Data.Entity.Infrastructure.Interception;
using AspNet.Identity.MongoDB;

namespace AspNetIdentityMongoWebAPI.API.Context
{
    public class UserBase
    {
        public string Id { get; set; }

        public string Email { get; set; }
        //[Required]
        public string FirstName { get; set; }

        // [Required]
        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string FullName
        {
            get
            {
                string dspFistName = string.IsNullOrWhiteSpace(this.FirstName) ? "" : this.FirstName;

                string dspMiddleName = string.IsNullOrWhiteSpace(this.MiddleName) ? " " : this.MiddleName;

                string dspLastName = string.IsNullOrWhiteSpace(this.LastName) ? "" : this.LastName;

                return string.Format("{0} {1} {2} ", dspFistName, dspMiddleName, dspLastName);
            }
            set { }
        }

        public virtual ApplicationUser ApplicationUser { get; set; }

        // Use a sensible display name for views:

        [Display(Name = "Postal Code")]

        public string PostalCode { get; set; }
        [Key]
        public string Organization { get; set; }

        public DateTime regDate { get; set; }

        // Concatenate the address info for display in tables and such:

        public string DisplayAddress
        {
            get
            {

                string dspAddress =

                    string.IsNullOrWhiteSpace(this.Address) ? "" : this.Address;

                string dspCity =

                    string.IsNullOrWhiteSpace(this.City) ? "" : this.City;

                string dspState =

                    string.IsNullOrWhiteSpace(this.State) ? "" : this.State;

                string dspPostalCode =

                    string.IsNullOrWhiteSpace(this.PostalCode) ? "" : this.PostalCode;



                return string

                    .Format("{0} {1} {2} {3}", dspAddress, dspCity, dspState, dspPostalCode);

            }

        }
    }

    public class ApplicationUser : IdentityUser
    {
        
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }

        [JsonIgnore]
        public virtual ICollection<UserBase> UserBase { get; set; }

        [JsonIgnore]
        public virtual ICollection<Datasets> Datasets { get; set; }

        [JsonIgnore]
        public virtual ICollection<Transactions> Transactions { get; set; }

        public ApplicationUser()
        {
            this.UserBase = new HashSet<UserBase>();
            this.Datasets = new HashSet<Datasets>();
            this.Transactions = new HashSet<Transactions>();
        }
    }

    //public class AuthContext : IdentityDbContext<ApplicationUser>//IdentityUser>
    //{
    //    static AuthContext()
    //    {
    //        DbInterception.Add(new FtsInterceptor());
    //    }
    //    public AuthContext()
    //        : base("AuthContext")
    //    {
            
    //    }
    //    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    //    {
    //        base.OnModelCreating(modelBuilder);
    //        modelBuilder.Configurations.Add(new DatasetsMap());
    //    }

    //    public DbSet<Client> Clients { get; set; }
    //    public DbSet<RefreshToken> RefreshTokens { get; set; }

    //    public DbSet<UserBase> UserBase { get; set; }

    //    public DbSet<Datasets> Datasets { get; set; }

    //    public DbSet<Category> Category { get; set; }

    //    public DbSet<UpgradeRequest> UpgradeRequest { get; set; }

    //    public DbSet<Transactions> Transactions { get; set; }

    //}


    public class ApplicationRole : IdentityRole
    {

        public ApplicationRole() : base() { }

        public ApplicationRole(string name) : base(name) { }

        public string Description { get; set; }

    }
    //public class IdentityManager
    //{
       


    //    public bool CreateUser(ApplicationUser user, string password)
    //    {
    //        //var um = new UserManager<ApplicationUser>(
    //        //    new UserStore<ApplicationUser>(new AuthContext()));
    //        var um = new ApplicationUserManager(new UserStore<ApplicationUser>(new AuthContext()));
    //        var idResult = um.Create(user, password);
    //        return idResult.Succeeded;
    //    }

      
    //}

}