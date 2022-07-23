aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 003358677937.dkr.ecr.us-east-1.amazonaws.com    

aws ecr create-repository --repository-name ancestry-face-restoration --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE

docker tag restore-face:latest 003358677937.dkr.ecr.us-east-1.amazonaws.com/ancestry-face-restoration:latest

docker push 003358677937.dkr.ecr.us-east-1.amazonaws.com/ancestry-face-restoration:latest