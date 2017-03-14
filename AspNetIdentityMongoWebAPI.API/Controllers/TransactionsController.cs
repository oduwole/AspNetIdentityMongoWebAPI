using Damorel.API.App_Start;
using Damorel.API.Context;
using Damorel.API.Models;
using Damorel.API.Repository;
using Microsoft.AspNet.Identity.Owin;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Damorel.API.Controllers
{
    [RoutePrefix("api/transactions")]
    public class TransactionsController : ApiController
    {
        
        //AuthContext _ctx;
        TransactionsRepository _repo;

        public ApplicationIdentityContext _ctx
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<ApplicationIdentityContext>();
                //return HttpContext.GetOwinContext().GetUserManager<ApplicationIdentityContext>();
            }
        }

        public TransactionsController()
        {
            //_ctx = new AuthContext();
            _repo = new TransactionsRepository();
        }
        // GET: api/Transactions
        //public IEnumerable<Transactions> Get()
        public  Task<List<Transactions>> Get()
        {
            return  _ctx.Transactions.Find(new BsonDocument()).ToListAsync();//.AsQueryable().Take(500);
        }

        [HttpGet]
        [Route("GetUsersTransactions")]
        public IHttpActionResult GetUsersTransactions(string user)
        {
            var result=_repo.GetUsersTransaction(user);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetTransactionsOnOrganization")]
        public IHttpActionResult GetTransactionsOnOrganization(string user)
        {
            var result = _repo.GetTransactionsOnOrganization(user);
            return Ok(result);
        }

        [HttpPost]
        [Route("PostUsersTransactions")]
        public async Task< IHttpActionResult> PostUsersTransactions(string user,Transactions trans)
        {
            var result =await _repo.AddUserTransactions(trans,user);
            return Ok(result);
        }

        //// GET: api/Transactions/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/Transactions
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/Transactions/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        // DELETE: api/Transactions/5
        public void Delete(int id)
        {
        }
    }
}
