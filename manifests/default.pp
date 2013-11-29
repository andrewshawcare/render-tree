exec {'apt-get update':
    path => '/usr/bin'
}

class {'nodejs':
    require => Exec['apt-get update'],
    manage_repo => true,
    version => '0.10.22-1chl1~precise1'
}

package {[
    'git'
]:
    ensure => installed
}

package {'bower':
    require => Class['nodejs'],
    ensure => installed,
    provider => 'npm'
}