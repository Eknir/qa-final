#General:
I believe that campaignSponsor should also be the one who owns the Campaign contract. Because right now the owner of the hub can hold the sponsor of the contract hostage, by stopping a successfull campaign. If this happens, he will be able to negotiate with the sponsor on a price to start the campaign again. The only reason where it might be good that the hub owner can stop all the associated campaigns is if there is a problem in the campaign codes or the regulator demands a temporary halt. If the former is the case, the campaign sponsor should be able to start the campaign again after analysing the code himself and in the case of the last reason, there should probably be a timeconstraint after which the campaign automatically starts again and/or a possibility for the funders and sponsors of the campaign to get their funds out, so the hub owner cannnot hold any party hostage.

Emitting events without the emit keyword is deprecated.

Campaign.sol

35 (Constructor):
It is possible to start a campaign with 0 as goal or 0 als deadline. It would be better to make guardrails (requiring that both amounts are not equal to zero), to prevent erronous input from an user.

70 (Contribute):
We define funderstruct storage on line 68 in an if condition. On line 70, we intent to use this declaration but that is not possible, since the else condition will only execute when the if doesn't execute (and hence funderstruct is not declared)

72 (contribute):
Initializing the amountRefunded at 0 does nothing, because this is already the default value.

76 (Contribute):
we increase the amountContributed for the msg.sender, but this was done already before. The effect is that for every person who contributes, there will be documented that he contributed double. This will be a problem in the withdraw function, since if the campain has failed, the people who withdraw first will be able to withdraw double their contribution, whereas those who will withdraw last will be left empty-handed.

41 (isSuccess) | 49 (hasFailed):
For readability and following conventions, it would be better to convert both these functions in a modifier.

90 (withdrawFunds):
We keep track of a uint refunded, but in fact this should be a boolean. Since there is no possibility for a partial withdrawal. It's either fully withdrawn or nothing. Making it a uint instead of a boolean decreases the readability of the code, since auditors and contributors will need to look into why you used a uint here. Besides, it increases the probability for errors.

90 (withdrawFunds):
The parameter 'refunded' should be named 'withdrawn'. Since this function doesn't refund anything to anybody.

98 (requestRefund):
The onlyIfRunning modifier in this function brings great risk to the funders; it means that they can never be guaranteed to get their money back, since the contract can always be placed in the notRunning state, without their consent and without them being able to do something about this. Effectively, it means that the owner of the contract can hold the funders hostage and require something valuable to stop his hostage.

101 (requestRefund):
just as in withDrawFunds, we keep track of a uint amountRefunded (in the funderstructs), whereas this should actually be a boolean. This is the case, because we cannot request a partial refund. It is all or nothing, black or white, true or false (boolean). Making it a uint instead of a boolean decreases the readability of the code, since auditors and contributors will need to look into why you used a uint here. Besides, it increases the probability for errors.

105 (requestRefund):
We do the operator +=, which is confusing for the auditor and potential contributor, since in fact the += operator does never something else than adding the amountOwned to 0, hence the = operator would suffice here.

Hub.sol
General: The hub inherits from Stopable, but none of the functionalities from stopable is every used. The Hub.sol should inherit from Owned, or use some of the Stopable functionalities in it's functions (which is not a bad idea in for example the createCampaign function).

13: We keep track of an array of Campagins, but never use this array anymore in the contract. On the front-end the array migh be used, but it can also be build by subscribing to the event LogNewCampaign. To save gas, I advice to get rid of this array on the smart-contract side.

26 (getCampaignCount): This function is actually the only reason why you should want to keep track of the array in the smart-contract. Since we can replicate the array easily on the front-end by watching the events, we can also get an array count this way. Only this function is not good enough of an argument to keep track of the campaigns in an array.

38 (createCampaign): missing a space between msg.sender and campaignDuration. This doesn't have any effect on code execution, but it's just a typo which looks as if there is no attention spend on the code.

Stoppable:

RunSwitch: There is no enforcement of actually returning the switch when this function is called. When the switch is true, and you run the function with true as argument, you might wronly think that you switch the contract from not running to running, whereas in fact the contract was already running. To prevent this, you could require that the input parameter is different than the actual state or running, you can make the switch a real switch by just setting running to !running, or perhaps best you can make a seperate function to set the state to run and a seperate one to set the state to not running.

Owned:
ChangeOwner: We don't check wether we don't set the new owner by accident to address(0).




Open questions:
in Campaign.sol, who is the campaignSponsor? Please take note that the owner can be different than the sponsor.


<>make a not about the running switch, since it means that the owner can gijzelen the participants
