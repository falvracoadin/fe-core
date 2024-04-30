properties(
[pipelineTriggers([pollSCM('* * * * *')])]
)


def FAILED_STAGE

pipeline {
    // agent { label "master" }
    agent any
    
    //environment 
  environment {


    // def HOOKS="https://hooks.slack.com/services/XXXXXX/YYYYYY/ZZZZZZZ"
    def GIT_HASH = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%h"').trim()
    def GIT_BRANCH_NAME = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
    def AUTHOR_NAME = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%an"').trim()
    def AUTHOR_EMAIL = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%ae"').trim()
    def AUTHOR_DATE_RELATIVE = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%ar"').trim()
    def GIT_SUBJECT = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%s"').trim()
}
    

    


    stages {


        stage('PREPARE') {

            steps {
                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "PREPARE"
                }

            sh label: 'prepare', script: 
            """
            prepare
            """      



            sh label: 'notif starting', script: 
            """
            notif start "${env.JOB_NAME} , Job No #${env.BUILD_NUMBER} ==> ${env.BUILD_URL}"
            """      

            }

        }


        stage('BUILD & TEST DEV') {
            when {
                branch 'develop'
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "BUILD & TEST DEV"
                }

                sh label: 'STEP BUILD & TEST DEV', script: 
                """
                build
                """

            }

        }

        stage('RELEASE DEV') {
            when {
                branch 'develop'
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "RELEASE DEV"
                }

                sh label: 'STEP RELEASE DEV', script: 
                """
                release
                """
         
            }

        }

        stage('DEPLOY DEV') {
            when {
                branch 'master'
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "DEPLOY DEV"
                }

                sh label: 'STEP DEPLOY DEV', script: 
                """
                deploy
                """
         
            }

        }


    stage("RELEASE CANDIDAT STA") {
            when {
                branch 'staging'
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "RELEASE CANDIDAT STA"
                }

                sh label: 'STEP RELEASE CANDIDAT STA', script: 
                """
                build
                release
                """                
            }

        }

    stage("DEPLOY CANDIDAT  STA") {
            when {
                branch 'staging'
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "DEPLOY STA"
                }

                sh label: 'STEP DEPLOY STA', script: 
                """
                deploy
                """                

                
            }

        }


    stage("RELEASE VERSION PRO") {
            when {
                tag "v*"
            }
            steps {

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "RELEASE VERSION PRO"
                }

                sh label: 'STEP RELEASE VERSION PRO', script: 
                """
                git checkout -b production
                build
                release
                """                
            }

        }



    stage("DEPLOY VERSION  PRO") {
            when {
                tag "v*"
            }

            steps {




            sh label: 'notif waiting', script: 
            """
            notif waiting "${env.JOB_NAME} , Job No #${env.BUILD_NUMBER}  ==> ${env.BUILD_URL}"
            """      



                timeout(time: 3600, unit: 'SECONDS') {
                input message: 'Deploy to Production ? (Click "Proceed" to continue)' 
                }

                script {
                    FAILED_STAGE=env.STAGE_NAME
                    echo "DEPLOY VERSION PRO"

                }




                sh label: 'STEP DEPLOY VERSION PRO', script: 
                """
                deploy
                """                                
            }

        }


    stage("ROLLBACK VERSION  PRO") {
            when {
                tag "v*"
            }

            options {
                timeout(time: 3600, unit: "SECONDS")
            }

            steps {

                       
                script {
                    FAILED_STAGE=env.STAGE_NAME
                    try {
                    echo "ROLLBACK VERSION PRO"

                  input message: 'Rollback version ? (Click "Proceed" to continue)' 
                    sh label: 'STEP ROLLBACK VERSION PRO', script: 
                    """
                    rollback-version
                    """                                
                     
                        // echo "Started stage A"
                        // sleep(time: 5, unit: "SECONDS")
                    } catch (Throwable e) {
                        echo "Caught ${e.toString()}"
                        currentBuild.result = "SUCCESS" 
                    }
                    
                    // notif success            
                    sh label: 'notif approve', script: 
                    """
                    notif approve "${env.JOB_NAME} , Job No #${env.BUILD_NUMBER} is SUCCESS"
                    """          

                }

            }

        }

         stage("FINISING") {
             steps {
                 script {
                     FAILED_STAGE=env.STAGE_NAME
                     echo "FINISING"
                    //================================== 
                    publishHTML (target : [allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'cicd',
                    reportFiles: 'index.html',
                    reportName: 'My Reports',
                    reportTitles: 'The Report'])
                    //==================================                                      
                 }
                    //================================== 
                    sh label: 'STEP FINISING', script: 
                    """
                    finising
                    """                   
                    //==================================                 
             }
         }


//END stages        
    }
    

//POST============================================================ 
    post {
        failure {
            // echo "Failed stage name: ${FAILED_STAGE}"

// notif failure
sh label: 'notif failure', script: 
"""
notif fail "STEP ==> ${FAILED_STAGE} #${env.JOB_NAME} , Job No #${env.BUILD_NUMBER} is FAILURE ==> ${env.BUILD_URL}"
"""                                    

// 
        }
        
        success {

// notif success            
sh label: 'notif success', script: 
"""
notif success "${env.JOB_NAME} , Job No #${env.BUILD_NUMBER} is SUCCESS"
"""          
            
        }        
        
    }

//END pipeline            
}
