select * from Contracts;
select * from Profiles where `type` = 'client';
select * from Profiles where `type` = 'contractor';
select * from Profiles where id = 2;
select * from Jobs where ContractId = 2;

select Pro.firstName, Con.id, Con.status 
  from Profiles Pro 
  join Contracts Con on (Con.ClientId = Pro.id) 
 where Con.ContractorId = 6;

select Jo.id as jobId, 
  	   Jo.price as jobPrice, 
  	   Cli.id as cliId, 
  	   Cli.firstName as "client", 
  	   Cli.balance as cliBalance, 
  	   Cont.firstName as contractor, 
  	   Cont.balance as contBalance
  from Jobs Jo 
  join Contracts Con on (Jo.ContractId = Con.id)
  join Profiles Cont on (Con.ContractorId = Cont.id)
  join Profiles Cli on (Con.ClientId = Cli.id)
 where Cli.id = 1
   and Con.status in ('new', 'in_progress')
   and Jo.paid is null;



-- 2	201	Harry	1150	Linus	1214


-- Best profession
select Cont.profession, sum(Jo.price) as received
  from Profiles Cont 
  join Contracts Con on (Con.ContractorId = Cont.id)
  join Jobs Jo on (Jo.ContractId = Con.id)
 where Cont."type" = 'contractor'
   and Jo.paid = 1
   and Jo.paymentDate BETWEEN '2020-08-01 00:00:00' and '2020-08-14 23:59:59'
 group by profession
 order by received desc;


-- Clients that paid the most
select Cli.id as ClientId, sum(Jo.price)
  from Jobs Jo
  join Contracts Cont on (Jo.ContractId = Cont.id)
  join Profiles Cli on (Cont.ClientId = Cli.id)
 where Cli."type" = 'client'
   and Jo.paid = 1
 group by Cli.id;