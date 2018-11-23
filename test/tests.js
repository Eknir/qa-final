let Hub = artifacts.require("./Hub.sol");
let Campaign = artifacts.require("./Campaign.sol");

const Promise = require("bluebird");


if (typeof web3.version.getNodePromise === "undefined") {
  Promise.promisifyAll(web3.version, {
    suffix: "Promise"
  });
}
if (typeof web3.eth.getAccountsPromise === "undefined") {
  Promise.promisifyAll(web3.eth, {
    suffix: "Promise"
  });
}

contract('Hub', function([hubOwner, account1, account2, account3]) {
	describe('deployment', function() {
		it("should fail to deploy a manager contract if passed value", function() {
      		return Hub.new({from: hubOwner, value: 1})
        .then(
        	() => assert.throw("should not have reached here"),
          	e => assert.isAtLeast(e.message.indexOf("non-payable constructor"), 0));
    	});

    	before(async function() {
     		this.hub = await Hub.new();
    	})
   		it("should have added the role of ROLE_HOLDING to the msg.sender", async function() {
      		assert.isTrue(await this.hub.owner() == hubOwner);
    	})
  	})

	describe('functions', function() {
		beforeEach(async function() {
  			this.hub = await Hub.new();
  		})
		describe('Create Campaign', function() {
			let duration = 1000;
			let goal = 1000;
  			it("Should have saved the campaign address in the trustedCampaigns array", async function() {
  	     		let tx = await this.hub.createCampaign(duration, goal, {from: account1})
  	     		let campaign = tx.logs[0].args.campaign
  	     		assert.isTrue(await this.hub.campaigns(0) == campaign)
  			})
  		})

  		describe('Contribute', function() {
  			let duration = 1000;
  			let goal = 1000;
  			let smallContribution = 10;
  			let largeContribution = 1010;
  			beforeEach(async function() {
  				this.hub = await Hub.new();
  				let tx = await this.hub.createCampaign(duration, goal);
  				this.campaign = Campaign.at(tx.logs[0].args.campaign);
  			})
  			it('Should register a contribution', async function() {
  				await this.campaign.contribute({value: smallContribution, from:account2})
  				assert.equal(await this.campaign.fundsRaised(), smallContribution);
  				let funderStruct = await this.campaign.funderStructs(account2);
  				console.log(funderStruct)
  				assert.equal(funderStruct[0], smallContribution);
  			})

  			it('Should register two contributions by the same address', async function() {
  				await this.campaign.contribute({value: smallContribution, from:account2})
  				await this.campaign.contribute({value: smallContribution, from:account2})
  				assert.equal(await this.campaign.fundsRaised(), smallContribution * 2);
  				let funderStruct = await this.campaign.funderStructs(account2);
  				assert.equal(funderStruct[0], smallContribution * 2);

  			})

  			it('Should declare the campaign successfull when contributed more than the goal', async function() {
  				await this.campaign.contribute({value: largeContribution})
  				assert.isTrue(await this.campaign.isSuccess());
  			})
  		})
  	})
})
