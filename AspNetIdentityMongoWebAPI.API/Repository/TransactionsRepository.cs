using Damorel.API.App_Start;
using Damorel.API.Context;
using Damorel.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Damorel.API.Repository
{
    public class TransactionsRepository
    {
        //private AuthContext _ctx;
        private ApplicationIdentityContext _ctx;
        public TransactionsRepository() {
            _ctx = new AuthContext();
        }

        public IQueryable<Transactions> GetUsersTransaction(string user)
        {
            var uid=_ctx.Users .Where (u=>u.Email ==user).Select (u=>u.Id).FirstOrDefault ();
            var result = _ctx.Transactions.Where(u => u.clientID == uid).AsQueryable();
            return result;
        }

        public IQueryable<Transactions> GetTransactionsOnOrganization(string user)
        {
            var uid = _ctx.Users.Where(u => u.Email == user).Select(u => u.Id).FirstOrDefault();
            var result = _ctx.Transactions.Where(u => u.merchantID  == uid).AsQueryable();
            return result;
        }

        public async  Task<int> AddUserTransactions(Transactions transactions,string user)
        {
            _ctx.Transactions.Add(transactions);
            var result = await _ctx.SaveChangesAsync();
            return result;
        }



    }
}
