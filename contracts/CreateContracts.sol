//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract UniblokContract {
    struct partyDetails {
        string jobTitle;
        string clientName;
        string serviceProvider;
    }
    struct contractOverview {
        uint256 estimatedBudget;
        uint256 estimatedHours;
        uint256 estimatedWeek;
        uint256 estimatedTeamSize;
        uint256 netSettlement;
    }
    struct serviceChargeDetails {
        uint256 uniblokServiceFee;
        uint256 expectedAmountToBeReceived;
        uint256 finalAmount;
    }
    struct typeAndDuration {
        string jobCategory;
        string OfferDate;
        string offerExpires;
        string expectedCompletionOn;
        string jobId;
        string acceptanceTime;
        string acceptanceDate;
    }
    partyDetails public partyDetail;
    contractOverview public ContractOverview;
    serviceChargeDetails public ServiceChargeDetails;
    typeAndDuration public TypeAndDuration;

    constructor(
        string[] memory _partyDetails,
        uint256[] memory _contractOverview,
        uint256[] memory _serviceChargeDetails,
        string[] memory _typeAndDuration
    ) {
        partyDetail = partyDetails({
            jobTitle: _partyDetails[0],
            clientName: _partyDetails[1],
            serviceProvider: _partyDetails[2]
        });
        ContractOverview = contractOverview({
            estimatedBudget: _contractOverview[0],
            estimatedHours: _contractOverview[1],
            estimatedWeek: _contractOverview[2],
            estimatedTeamSize: _contractOverview[3],
            netSettlement: _contractOverview[4]
        });
        ServiceChargeDetails = serviceChargeDetails({
            uniblokServiceFee: _serviceChargeDetails[0],
            expectedAmountToBeReceived: _serviceChargeDetails[1],
            finalAmount: _serviceChargeDetails[2]
        });
        TypeAndDuration = typeAndDuration({
            jobCategory: _typeAndDuration[0],
            OfferDate: _typeAndDuration[1],
            offerExpires: _typeAndDuration[2],
            expectedCompletionOn: _typeAndDuration[3],
            jobId: _typeAndDuration[4],
            acceptanceTime: _typeAndDuration[5],
            acceptanceDate: _typeAndDuration[6]
        });
    }
}
