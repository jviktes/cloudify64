pipeline {
    triggers {
            pollSCM('H/15 * * * *')
    }
    agent { label 'web-ui-04888827' }

    stages {
        stage('Clean') {
            steps {
                sh '''sudo npm cache clean
                  bower cache clean
                  sudo chown jenkins:jenkins -R ../*'''
                step([$class: 'WsCleanup'])
            }
        }

        stage('Build') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'cloudify-stage']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '5006a20b-84d4-4681-ae49-886247acd47b', url: 'https://github.com/cloudify-cosmo/cloudify-stage.git']]])
                dir('cloudify-stage') {
                    sh '''sudo npm install
                          sudo npm install webpack -g
                          sudo npm install bower -g
                          sudo npm install gulp -g
                          sudo npm install grunt-cli -g
                          bower install'''
                    dir('semantic') {
                        sh 'gulp build'
                    }
                    sh 'grunt build'
                    dir('backend') {
                        sh 'npm install'
                    }
                    sh 'webpack --config webpack.config-prod.js --bail'
                    sh 'sudo chown jenkins:jenkins -R .'
                }
            }
        }

        stage('Pack') {
            steps {
                dir('cloudify-stage') {
                    sh 'sudo npm run zip'
                }
                sh '''. ${JENKINS_HOME}/jobs/credentials.sh > /dev/null 2>&1
                      curl -u $GITHUB_USERNAME:$GITHUB_PASSWORD https://raw.githubusercontent.com/cloudify-cosmo/cloudify-premium/master/packages-urls/common_build_env.sh -o ./common_build_env.sh
                      . $PWD/common_build_env.sh
                      mv cloudify-stage/stage.tar.gz  cloudify-stage-$VERSION-$PRERELEASE.tgz'''

            }
        }

        stage('Upload package to S3') {
            steps {
                sh '''set +x
                      . ${JENKINS_HOME}/jobs/credentials.sh > /dev/null 2>&1
                      curl -u $GITHUB_USERNAME:$GITHUB_PASSWORD https://raw.githubusercontent.com/cloudify-cosmo/cloudify-premium/master/packages-urls/common_build_env.sh -o ./common_build_env.sh
                      . $PWD/common_build_env.sh
                      s3cmd put --access_key=${AWS_ACCESS_KEY_ID_UPLOAD_TEMP} --secret_key=${AWS_ACCESS_KEY_UPLOAD_TEMP} --human-readable-sizes --acl-public \\
                      cloudify-stage-$VERSION-$PRERELEASE.tgz \\
                      s3://$AWS_S3_BUCKET/$AWS_S3_PATH/'''
            }
        }
    }

    post {
        always {
          sh 'sudo chown jenkins:jenkins -R ../*'
          deleteDir()
        }

        failure {
          //mail(from: "jenkins-master-on-aws@gigaspaces.com",
          //     to: "kinneret@gigaspaces.com, limor@gigaspaces.com",
          //     subject: "UI build failed!",
          //     body: "For more information see the build log.")
          emailext attachLog: true, body: 'For more information see the build log.', recipientProviders: [[$class: 'FirstFailingBuildSuspectsRecipientProvider'], [$class: 'DevelopersRecipientProvider']], subject: 'UI build failed!', to: 'kinneret@gigaspaces.com,limor@gigaspaces.com'
        }
      }

      // The options directive is for configuration that applies to the whole job.
      options {
        buildDiscarder(logRotator(numToKeepStr:'30'))
        timeout(time: 60, unit: 'MINUTES')
      }
}