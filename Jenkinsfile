pipeline {
  agent any

  environment {
    DOCKERHUB_USER = 'sanjeebnepal'
    BACKEND_IMAGE = "${DOCKERHUB_USER}/capstone-backend:v${BUILD_NUMBER}"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/capstone-frontend:v${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', git credentialsId: 'github-creds', url: 'https://github.com/sanjeebnepal/capstone-sanjeeb.git'
      }
    }

    stage('Build Backend Image') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./backend'
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
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
          sed "s|IMAGE_BACKEND|$BACKEND_IMAGE|" k8s/backend-deployment.yaml | kubectl apply -f -
          sed "s|IMAGE_FRONTEND|$FRONTEND_IMAGE|" k8s/frontend-deployment.yaml | kubectl apply -f -
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Deployment to K3s successful!"
    }
    failure {
      echo "❌ Deployment failed."
    }
  }
}
