using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Damorel.API.Context;
using Damorel.API.Models;
using Damorel.API.Repository;
using System.Web;
using Damorel.API.Entities;

namespace Damorel.API.Controllers
{
    [RoutePrefix("api/Datasets")]
    public class DatasetsController : ApiController
    {
        DatasetsRepository _repo;
        public DatasetsController()
        {
            _repo = new DatasetsRepository();
        }

        // GET: api/Datasets
        public IHttpActionResult GetDatasets()
        {
            var result=_repo.GetDatasets().Take(20).OrderByDescending(u=>u.UploadedDate).ToList();
            return Ok(result);
        }

        [Route("GetDatasetsBySearch")]
        public IHttpActionResult GetDatasetsBySearch(string query)
        {
            if (query == null)
                return Ok(new List<Datasets> { });
            var s = FtsInterceptor.Fts("john");
            using (var db = new AuthContext())
            {
                var q = db.Datasets.Where(n => n.Description.Contains(query)).Where(u=>u.ApprovalStatus ==true );
                //var q = db.Notes.Where(n => n.NoteText.Contains(s));
                var result = q.Take(10).ToList();
                return Ok(result);
            }
        }

        [Route("GetDatasetPathFromTId")]
        public IHttpActionResult GetDatasetPathFromTId(Guid transid)
        {
            if (transid == null)
                return Ok(string .Empty );
            var result = _repo.GetDatasetPathFromTId(transid);
            return Ok(result);
        }

        [Route("GetDatasetById")]
        public IHttpActionResult GetDatasetById(Guid id)
        {
            if (id == null)
                return Ok(new Datasets() { });
            var result = _repo.GetDatasetById(id);
            return Ok(result);
        }

        [Route("GetDatasetsByStatus")]
        public IHttpActionResult GetDatasetsByStatus(bool status)
        {
            
            var datasets =  _repo.GetDatasetsByStatus(status ).ToList ();
            if (datasets == null)
            {
                return NotFound();
            }

            return Ok(datasets);
        }

         [Route("GetUserDatasetsByStatus")]
        public IHttpActionResult GetUserDatasetsByStatus(string user,bool status)
        {

            var datasets = _repo.GetUserDatasetsByStatus(user,status).ToList();
            if (datasets == null)
            {
                return NotFound();
            }

            return Ok(datasets);
        }

        [Route("GetOrganizationDatasets")]
        public IHttpActionResult GetOrganizationDatasets(string user)
        {
            if (user == null)
                return Ok(new List<Datasets> { });
            var datasets = _repo.GetOrganizationDatasets(user).ToList();
            if (datasets == null)
            {
                return NotFound();
            }

            return Ok(datasets);
        }

        [HttpPost]
        [Route("EditDatasetApproval")]
        public IHttpActionResult EditDatasetApproval(Guid id,bool status)
        {
            if (id == null)
                return BadRequest("Invalid Transaction ID");
           var result = _repo.EditDatasetApproval(id, status);
            return Ok(result);
        }

        // GET: api/Datasets/5
        [ResponseType(typeof(Datasets))]
        public async Task<IHttpActionResult> GetDatasets(Guid id)
        {

            var datasets =await _repo.GetDatasets(id);
            if (datasets == null)
            {
                return NotFound();
            }

            return Ok(datasets);
        }

        // PUT: api/Datasets/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDatasets(Guid id, Datasets datasets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != datasets.TransactionID)
            {
                return BadRequest();
            }
            try
            {
                var result =await _repo.PutDatasets(id, datasets);
                if (result == "Not Found")
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {
                throw;
            }
            
            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Datasets
        [ResponseType(typeof(Datasets))]
        public async Task<IHttpActionResult> PostDatasets(Datasets datasets,string user)
        {
            string userName="";
            string userId;
            if (HttpContext.Current != null && HttpContext.Current.User != null
                    && HttpContext.Current.User.Identity.Name != null)
            {
                userName = HttpContext.Current.User.Identity.Name;
               // userId = HttpContext.Current.User.Identity.//GetUserId();
            }
            else
            {
                userName = user;
            }
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            try
            {
                var result=await _repo .PostDatasets (user,datasets );
                if(result =="Conflict"){
                    return Conflict ();
                }
            }catch(Exception ){
                throw ;
            }

            return CreatedAtRoute("DefaultApi", new { id = datasets.TransactionID }, datasets);
        }

        // DELETE: api/Datasets/5
        [ResponseType(typeof(Datasets))]
        public async Task<IHttpActionResult> DeleteDatasets(Guid id)
        {
            var result =await _repo.DeleteDatasets(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
            //return Ok(datasets);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
              //  db.Dispose();
            }
            base.Dispose(disposing);
        }

       
    }
}