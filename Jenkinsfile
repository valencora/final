pipeline {

    agent any

    

    environment {

        DOCKER_IMAGE = 'blogapp/blog-app'  

        DOCKER_TAG = "${env.BUILD_NUMBER}"

    }

    

    stages {

        stage('Checkout') {

            steps {

                checkout scm

            }

        }

        

        stage('Build') {

            steps {

                script {

                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {

                        dir('backend') {

                            sh 'mvn clean package -DskipTests -Dskip.npm -Dskip.installnodenpm -B'

                        }

                    }

                }

            }

        }

        

        stage('Test') {

            steps {

                script {

                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {

                        dir('backend') {

                            sh 'mvn test -Dskip.npm -Dskip.installnodenpm'

                        }

                    }

                }

            }

            post {

                always {

                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/**/*.xml'

                }

            }

        }

        

        stage('Package') {

            steps {

                script {

                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {

                        dir('backend') {

                            sh 'mvn -ntp -Pprod clean package -DskipTests -Dskip.npm -Dskip.installnodenpm'

                        }

                    }

                }

            }

        }

        

        stage('Publish Docker Image') {

            steps {

                script {

                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {

                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_REGISTRY_PWD', usernameVariable: 'DOCKER_REGISTRY_USER')]) {

                            dir('backend') {

                                sh "mvn -ntp jib:build -Djib.to.image=${DOCKER_IMAGE}:${DOCKER_TAG} -Djib.to.tags=latest,${DOCKER_TAG}"

                            }

                        }

                    }

                }

            }

        }

    }

    

    post {

        success {

            echo ":white_check_mark: Pipeline completed successfully! Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"

        }

        failure {

            echo ":x: Pipeline failed!"

        }

        always {

            // Limpiar workspace con manejo de errores

            script {

                try {

                    cleanWs()

                } catch (Exception e) {

                    echo ":warning: No se pudo limpiar el workspace: ${e.message}"

                }

            }

        }

    }

}

