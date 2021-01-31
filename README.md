Deploy:

```
docker build . --tag docker-registry.jonaspfannschmidt.com/personal-site:latest
docker push docker-registry.jonaspfannschmidt.com/personal-site:latest
```

In personal-servers:

```
ansible-playbook -i ./hosts --vault-id @prompt partial_personal-site.yml
```
