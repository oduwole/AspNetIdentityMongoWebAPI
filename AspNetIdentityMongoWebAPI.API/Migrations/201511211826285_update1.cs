namespace Deitalyst.API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class update1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Transactions",
                c => new
                    {
                        TransactionID = c.Guid(nullable: false, identity: true, defaultValueSql: "newid()"),
                        AppID = c.Int(nullable: false, identity: true),
                        Id = c.String(maxLength: 128),
                        reverseStatus = c.Boolean(nullable: false),
                        clientID = c.String(),
                        merchantID = c.String(),
                        TransactionDate = c.DateTime(nullable: false),
                        TransactionIP = c.String(),
                        productPrice = c.Double(nullable: false),
                        ProductID = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.TransactionID)
                .ForeignKey("dbo.AspNetUsers", t => t.Id)
                .Index(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Transactions", "Id", "dbo.AspNetUsers");
            DropIndex("dbo.Transactions", new[] { "Id" });
            DropTable("dbo.Transactions");
        }
    }
}
