---
name: devsecops-practice
description: >-
  Use this skill when the user asks to run security scans (SAST, SCA, container scanning),
  audit Dockerfiles, build and push images to Amazon ECR, configure AWS IAM OIDC,
  or deploy/update tasks on AWS ECS Fargate.
---

# DevSecOps Practice Runbook

This skill provides step-by-step procedures for securing and deploying the InnerPeace application.

## 1. Local Security Scanning (Shift-Left)

### Secret Detection (Gitleaks)
```bash
# Scan whole working tree against repository policy
docker run --rm -v "$PWD:/path" zricethezav/gitleaks:latest dir /path -c /path/.gitleaks.toml -v

# Scan staged git diff before committing
docker run --rm -v "$PWD:/path" -w /path zricethezav/gitleaks:latest protect --staged --verbose --config .gitleaks.toml
```

### Static Application Security Testing (Semgrep)
```bash
docker run --rm -v "$PWD:/src" semgrep/semgrep semgrep scan --config=auto /src
```

### Dependency Vulnerability Audit (SCA)
```bash
cd innerpeace-backend && npm audit --omit=dev
cd ../innerpeace-forntend && npm audit
```

## 2. Container Security & ECR

### Trivy Container Vulnerability Scan
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image --severity HIGH,CRITICAL --exit-code 1 <image-name>:<tag>
```

### Amazon ECR Login & Push
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
docker tag <image-name>:<tag> <account_id>.dkr.ecr.<region>.amazonaws.com/<image-name>:<tag>
docker push <account_id>.dkr.ecr.<region>.amazonaws.com/<image-name>:<tag>
```

## 3. ECS Fargate Deployment Check
- Ensure IAM task execution role has SSM permissions for secure strings.
- Verify ALB target group health check returns HTTP 200 before completing rolling deployment.
