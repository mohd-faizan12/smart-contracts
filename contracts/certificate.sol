//SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.7;

contract GenerateCertificate {
    struct CertificateDetails {
        string email;
        string certName;
        string CertificationLevel;
        string issuerName;
        string issuerId;
        string issuedBy;
        string issuedByDesgnation;
        string creationDate;
        string certId;
        uint256 fees;
        uint256 maximumMarks;
        uint256 marks;
    }

    CertificateDetails public certificate;

    constructor(
        string memory _email,
        string memory _certName,
        string memory _CertificationLevel,
        string[] memory _issuerDetails,
        string memory _creationDate,
        string memory _certId,
        uint256 _fees,
        uint256 _maximumMarks,
        uint256 _marks
    ) {
        certificate = CertificateDetails({
            email: _email,
            certName: _certName,
            CertificationLevel: _CertificationLevel,
            issuerName: _issuerDetails[0],
            issuerId: _issuerDetails[1],
            issuedBy: _issuerDetails[2],
            issuedByDesgnation: _issuerDetails[3],
            creationDate: _creationDate,
            certId: _certId,
            fees: _fees,
            maximumMarks: _maximumMarks,
            marks: _marks
        });
    }
}