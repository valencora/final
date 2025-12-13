pipeline {

    agent any

    

    environment {

        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')

        DOCKER_IMAGE = 'blogapp/blog-app'

        DOCKER_TAG = "${env.BUILD_NUMBER}"

    }

    

    stages {

        stage('Checkout') {

            steps {

                echo 'Checking out code from repository...'

                checkout scm

            }

        }

        

        stage('Build Backend') {

            steps {

                echo 'Building backend application...'

                dir('backend') {

                    sh 'mvn clean package -DskipTests'

                }

            }

        }

        

        stage('Run Unit Tests') {

            steps {

                echo 'Running unit tests...'

                dir('backend') {

                    sh 'mvn test'

                }

            }

        }

        

        stage('Build Docker Image') {

            steps {

                echo 'Building Docker image...'

                script {

                    dir('backend') {

                        def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "-f Dockerfile .")

                        image.tag("${DOCKER_IMAGE}:latest")

                    }

                }

            }

        }

        

        stage('Login to Docker Hub') {

            steps {

                echo 'Logging in to Docker Hub...'

                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

            }

        }

        

        stage('Push Docker Image') {

            steps {

                echo 'Pushing Docker image to Docker Hub...'

                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"

                sh "docker push ${DOCKER_IMAGE}:latest"

            }

        }

        

        stage('Cleanup') {

            steps {

                echo 'Cleaning up...'

                sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"

                sh "docker rmi ${DOCKER_IMAGE}:latest || true"

            }

        }

    }

    

    post {

        success {

            echo 'Pipeline completed successfully!'

            emailext (

                subject: "Pipeline Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",

                body: "Build succeeded. Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}",

                to: "${env.CHANGE_AUTHOR_EMAIL}"

            )

        }

        failure {

            echo 'Pipeline failed!'

            emailext (

                subject: "Pipeline Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",

                body: "Build failed. Please check the logs.",

                to: "${env.CHANGE_AUTHOR_EMAIL}"

            )

        }

        always {

            cleanWs()

        }

    }

}
