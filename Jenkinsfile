pipeline {
  agent any

  environment {
    DOCKERHUB_USER = 'sanjeebnepal'
    FRONTEND_API_URL = 'http://4.242.19.71:32000'
    BACKEND_IMAGE = "${DOCKERHUB_USER}/capstone-backend:v${BUILD_NUMBER}"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/capstone-frontend:v${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/sanjeebnepal/capstone-sanjeeb.git'
      }
    }

    stage('Build Backend Image') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./backend'
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh 'docker build --build-arg REACT_APP_API_URL=${FRONTEND_API_URL} -t $FRONTEND_IMAGE ./frontend'
      }
    }

    stage('Push Images to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $BACKEND_IMAGE
            docker push $FRONTEND_IMAGE
          '''
        }
      }
    }

    stage('Deploy to K3s') {
      steps {
        sh '''
        export KUBECONFIG=/var/lib/jenkins/.kube/config
        sed "s|IMAGE_BACKEND|$BACKEND_IMAGE|" k8s/backend-deployment.yml | kubectl apply -f -
        sed "s|IMAGE_FRONTEND|$FRONTEND_IMAGE|" k8s/frontend-deployment.yml | kubectl apply -f -
        '''
        }
    }

  }

  post {
    success {
      echo "✅ Deployment to K3s successful!"
    }
    failure {
      echo "❌ Deployment failed." /damn
    }
  }
}
