using Damorel.API.Context;
using Damorel.API.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Damorel.API.Repository
{
    public class DatasetsRepository
    {
    private AuthContext db;
    private string _user;
    private ApplicationUserManager _userManager;
        public DatasetsRepository(){
            db = new AuthContext();
        }

        public DatasetsRepository(string user)
        {
            db = new AuthContext();
            _userManager = new ApplicationUserManager(new UserStore<ApplicationUser>(db));
        }

        public IQueryable <Datasets> GetDatasets(){
            return db.Datasets;
        }

        public async Task<Datasets> GetDatasets(Guid id)
        {
            var datasets = await db.Datasets.FindAsync(id);           
            return datasets;
        }

        public IQueryable < Datasets> GetDatasetsByStatus(bool status)
        {
            var datasets = db.Datasets.Where (u=>u.ApprovalStatus == status ).Select (u=>u);
            return datasets;
        }

        public Datasets GetDatasetById(Guid id)
        {
            var result = db.Datasets.Where(u => u.TransactionID == id).Select(u => u).FirstOrDefault();
            return result;
        }

        public string GetDatasetPathFromTId(Guid transid)
        {
            var org = db.Datasets.Where(u => u.TransactionID == transid).Select(u => u.Organization).FirstOrDefault();
            if (org != null)
            {
                var result = db.UserBase.Where(u => u.Organization == org).Select(u => u.Email).FirstOrDefault();
                return result;
            }
            return null;
        }

        public IQueryable<Datasets> GetOrganizationDatasets(string user)
        {
            var org = db.UserBase.Where(u => u.Email == user).FirstOrDefault ();
            var datasets = db.Datasets.Where(u => u.Organization == org.Organization ).Select(u => u);
            return datasets;
        }

        public async Task<string> PutDatasets(Guid id,Datasets datasets)
        {
            db.Entry(datasets).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
                return "success";
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DatasetsExists(id))
                {
                    return "Not Found";
                    //return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        public async Task<string> PostDatasets(string user,Datasets dataset)
        {
            var org = db.UserBase.Where(u => u.Email == user).Select(u => u.Organization).FirstOrDefault();
            var uid=await db.Users .Where (u=>u.Email ==user).Select (u=>u).FirstOrDefaultAsync();//await  _userManager.FindByEmailAsync(user);

            Datasets datasets = new Datasets()
            {
                ApprovalStatus = dataset.ApprovalStatus,
                Category = dataset.Category,
                Description = dataset.Description,
                FileUrl = dataset.FileUrl,
                IsDataOpen = dataset.IsDataOpen,
                isDeleted = false,
                isPromoOn = false,
                Name = dataset.Name,
                Organization =org, //dataset.Organization,
                Price = dataset.Price,
                TransactionID = new Guid(),
                UploadedDate = DateTime.Now,
                Id = uid.Id
            };
            db.Datasets.Add(datasets);

            try
            {
                await db.SaveChangesAsync();
                return "success";
            }
            catch (DbUpdateException)
            {
                if (DatasetsExists(datasets.TransactionID))
                {
                    return "Conflict"; //Conflict();
                }
                else
                {
                    throw;
                }
            }
        }

        public async Task<Datasets > DeleteDatasets(Guid id)
        {
            Datasets datasets = await db.Datasets.FindAsync(id);
            if (datasets == null)
            {
                return null;
                //return NotFound();
            }

            db.Datasets.Remove(datasets);
            await db.SaveChangesAsync();
            return datasets;
        }

        public int EditDatasetApproval(Guid id, bool status)
        {
            int result = 0;
            var dsets =db.Datasets.Where(u => u.TransactionID == id).FirstOrDefault ();
            if (dsets  != null)
            {
                dsets.ApprovalStatus = status;
                result =  db.SaveChanges();
                return result;
            }
            return result;
        }

        private bool DatasetsExists(Guid id)
        {
            return db.Datasets.Count(e => e.TransactionID == id) > 0;
        }

        public IQueryable < Datasets> GetUserDatasetsByStatus(string user, bool status)
        {
            var uid = db.UserBase.Where(u => u.Email == user).Select(u => u.Id).FirstOrDefault();
            var datasets = db.Datasets.Where(u => u.ApprovalStatus == status && u.Id==uid).Select(u => u);
            return datasets;
        }
    }
}
