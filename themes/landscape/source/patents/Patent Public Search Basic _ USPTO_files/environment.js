const HOSTS = {
    'dev.ppubs.awslab.uspto.gov': 'awsdev',
    'test.ppubs.awslab.uspto.gov': 'awstest',
    'perftest.ppubs.awslab.uspto.gov':'awsperf',
    'staging.ppubs.aws.uspto.gov':'awsstaging',
    'ppubs.uspto.gov':'awsprod',
    'localhost': 'local'
};

function setEnvironment() {
    //do not use uppercase - values used by url requests which are case sensitive;
    window.environment = HOSTS[window.location.hostname];

    const htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.className += window.environment;
}

setEnvironment();
