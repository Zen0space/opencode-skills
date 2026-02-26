# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue. Instead:

1. **Email**: Send details to the maintainer via GitHub's private vulnerability reporting
2. **GitHub Security Advisory**: Use [GitHub's private vulnerability reporting](https://github.com/Zen0space/opencode-skills/security/advisories/new)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Initial response**: Within 48 hours
- **Triage & confirmation**: Within 7 days
- **Fix & disclosure**: Depends on severity, typically within 14 days

### Disclosure Policy

- We follow responsible disclosure
- CVEs will be requested for significant vulnerabilities
- Security advisories will be published on GitHub

## Supply Chain Security

This package implements the following supply chain security measures:

### For Consumers

| Feature | Status | Verification |
|---------|--------|--------------|
| npm Provenance | Enabled | `npm audit signatures` |
| Lockfile | Committed | Check `package-lock.json` |
| SBOM | Generated | See releases |
| CodeQL Scanning | Enabled | Security tab |

### Verify Package Integrity

```bash
# Verify provenance signature
npm audit signatures ocs-stats

# View provenance info
npm view ocs-stats --json | jq '.dist.attestations'

# Download and verify SBOM
gh release download --pattern sbom.spdx.json
```

### For Contributors

- All PRs require CI checks to pass
- Security audit runs on every push
- Dependabot monitors for vulnerable dependencies
- CodeQL scans run weekly

## Security Features

### Package Hardening

- `engine-strict=true` - Enforces Node.js version requirements
- `ignore-scripts=true` - Prevents malicious post-install scripts
- `audit-level=moderate` - Fails on moderate+ vulnerabilities

### CI/CD Security

- Dependency review on all PRs
- Automated security scanning (CodeQL)
- npm provenance on publish
- Signed releases with SBOM artifacts

## Known Security Considerations

This package has **zero runtime dependencies**, minimizing supply chain attack surface.

The package:
- Does not collect or transmit any user data
- Does not execute external code
- Only copies template files to the user's project directory

## Contact

For security concerns, contact: [@Zen0space](https://github.com/Zen0space)
