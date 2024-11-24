//Executar comandos de apply no minikube


kubectl apply -f paymentservice-deployment.yaml
kubectl apply -f paymentservice-service.yaml

kubectl apply -f postgres-storage.yaml
kubectl apply -f postgres-deployment.yaml 

kubectl logs -f paymentservice-deployment-6c7947988d-vsgrx

kubectl delete pod paymentservice-deployment-6c7947988d-vsgrx


PRIMEIRO:
paymentservice-deployment

SEGUNDO:
paymentservice-service

TERCEIRO:
postgres-storage

QUARTO:
postgres-deployment


COMANDO PARA ABRIR O TUNEL DO MINIKUBE:
minikube tunnel