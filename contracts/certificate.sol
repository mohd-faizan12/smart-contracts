//SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.7;

contract GenerateCertificate {
    struct CertificateDetails {
        string userName;
        string certName;
        string CertificationLevel;
        string CreatedBy;
        uint256 creationDate;
    }
    /**
     *mapping: to store generated certificate
     */
    mapping(address => mapping(uint256 => CertificateDetails))
        private certificate;

    mapping(address => mapping(uint256 => bool)) private isCertified;

    uint256 private uinqueId = 0;

    /**
     *method: to generate certificate
     */
    function generateCertificate(
        string calldata _userName,
        string calldata certName,
        string calldata _CertificationLevel,
        string calldata _CreatedBy
    ) external {
        CertificateDetails memory myStruct = CertificateDetails({
            userName: _userName,
            certName: certName,
            CertificationLevel: _CertificationLevel,
            CreatedBy: _CreatedBy,
            creationDate: block.timestamp
        });

        certificate[msg.sender][uinqueId] = myStruct;
        isCertified[msg.sender][uinqueId] = true;
    }

    /**
     *method: to get certificate
     */
    function gEtYourCertificate(address _user, uint256 _Id)
        external
        view
        returns (CertificateDetails memory)
    {
        return certificate[_user][_Id];
    }

    /**
     *method: to  certificate verification
     */
    function verification(address _user, uint256 _uinqueId)
        external
        view
        returns (bool)
    {
        return isCertified[_user][_uinqueId];
    }
}
